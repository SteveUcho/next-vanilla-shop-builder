import { FC, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CatalogItem from "../../components/Catalog/CatalogItem";
import FilterOptions from "../../components/Catalog/FilterOptions";
import { catalogResponse, savedItemsResponse } from "../../types/CatalogTypes";
import update from 'immutability-helper';

interface catalogProps {
    catalogData: catalogResponse
}

const catalog: FC<catalogProps> = function catalog({
    catalogData,
}) {
    const [savedItemsState, setSavedItemsState] = useState(new Set());

    useEffect(() => {
        const fetchInitData = async () => {
            const tempRes = await fetch('http://localhost:3000/api/get/catalog/savedItems')
            const res = await tempRes.json();
            const set = new Set(res.savedItems);
            setSavedItemsState(set);
        }
        fetchInitData();
    }, [])
    
    function modifyState(itemID: string, saved: boolean) {
        let temp;
            if (saved) {
                temp = update(savedItemsState, {
                    $remove: [itemID]
                })
            } else {
                temp = update(savedItemsState, {
                    $add: [itemID]
                })
            }
        setSavedItemsState(temp);
    }

    return (
        <Container>
            <h1>Catalog</h1>
            <Row>
                <Col md={3}>
                    <FilterOptions filterCategories={catalogData.filterCategories} />
                </Col>
                <Col md={9}>
                    <Row>
                        {
                            catalogData.items.map((item) => {
                                if (!savedItemsState.has(item._id)) {
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