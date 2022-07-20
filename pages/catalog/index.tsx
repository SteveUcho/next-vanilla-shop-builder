import type { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CatalogItem from "../../components/Catalog/CatalogItem";
import FilterOptions from "../../components/Catalog/FilterOptions";
import { catalogResponse } from "../../types/CatalogTypes";
import update from 'immutability-helper';
import { useRouter } from "next/router";
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";

const fetcher = async (url: string) => {
    const tempRes = await fetch(url);
    const res = await tempRes.json();
    if (!tempRes.ok) {
        const error = new Error(res.message);
        throw error;
    }
    return res;
};

interface catalogProps {
    catalogData: catalogResponse
}

const catalog: FC<catalogProps> = function catalog({
    catalogData,
}) {
    const { data: savedData, mutate } = useSWR('/api/get/catalog/savedItems', fetcher);

    const modifyState = async (itemID: string, saved: boolean) => {
        let optimisticData = new Set(savedData.savedItems);
        if (saved) {
            optimisticData = update(optimisticData, {
                $remove: [itemID]
            })
        } else {
            optimisticData = update(optimisticData, {
                $add: [itemID]
            })
        }
        const tempFunc = async () => {
            const tempRes = await fetch('/api/post/saveItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: itemID }),
            })
            const res = await tempRes.json()
            if (res.didUpdate) {
                toast.success("Change Saved!");
                return {savedItems: Array.from(optimisticData)};
            } else {
                const newErr = new Error("Item not saved");
                throw newErr; 
            }
        }
        try {
            await mutate(tempFunc, {
                optimisticData: {savedItems: Array.from(optimisticData)},
                rollbackOnError: true,
                revalidate: false,
                populateCache: true
            });
        } catch (e) {
            toast.error("Failed to add the new item.");
        }
    }

    return (
        <Container>
            <Toaster toastOptions={{ position: "top-center" }} />
            <h1>Catalog</h1>
            <Row>
                <Col md={3}>
                    <FilterOptions filterCategories={catalogData.filterCategories} />
                </Col>
                <Col md={9}>
                    <Row>
                        { savedData ?
                            catalogData.items.map((item) => {
                                if (!(new Set(savedData.savedItems)).has(item._id)) {
                                    // item is in saved items list
                                    return (
                                        <Col md={3} sm={6} key={item._id} >
                                            <CatalogItem itemPreview={item} saved={false} stateHandler={modifyState} />
                                        </Col>
                                    )
                                } else {
                                    return (
                                        <Col md={3} sm={6} key={item._id} >
                                            <CatalogItem itemPreview={item} saved={true} stateHandler={modifyState} />
                                        </Col>
                                    )
                                }
                            })
                            : null
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export async function getStaticProps() {
    const catalogRes = await fetch('http://localhost:3000/api/get/catalog/getFullCatalog');
    const catalogData = await catalogRes.json();
    return {
        props: {
            catalogData,
        },
    }
}

export default catalog;