import type { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CatalogItem from "../../components/Catalog/CatalogItem";
import FilterOptions from "../../components/Catalog/FilterOptions";
import { catalogResponse } from "../../types/CatalogTypes";
import update from 'immutability-helper';
import clientPromise from '../../lib/mongodb';
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";

const fetcher = async (url: string) => {
    const tempRes = await fetch(url);
    const res = await tempRes.json();
    if (!tempRes.ok) {
        throw new Error(res.message);
    }
    return res;
};

interface CatalogProps {
    catalogData: catalogResponse
}

const catalog: FC<CatalogProps> = ({
    catalogData,
}) => {
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
                return { savedItems: Array.from(optimisticData) };
            } else {
                throw new Error("Item not saved");
            }
        }
        try {
            await mutate(tempFunc, {
                optimisticData: { savedItems: Array.from(optimisticData) },
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
                        {savedData ?
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
    const connection = await clientPromise;

    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');

    const tempCatalog = catalogCollection.find({}).project({ propertyInputs: 0 });
    const fullCatalog = await tempCatalog.toArray();

    const fixedCatalog = fullCatalog.map((catItem) => {
        return ({
            ...catItem,
            _id: catItem._id.toString(),
            creatorID: catItem.creatorID.toString()
        })
    })

    const temp = {
        filterCategories: [
            {
                name: "Item Type",
                type: "checkbox",
                options: ["Widgets", "Fonts"]
            },
            {
                name: "Price",
                type: "radio",
                options: ["Free", "$.99", "$2.99"]
            }
        ],
        items: fixedCatalog
    }

    return {
        props: {
            catalogData: temp,
        },
    }
}

export default catalog;