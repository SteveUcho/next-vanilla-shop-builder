import type { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CatalogItem from "../../components/Catalog/CatalogItem";
import FilterOptions from "../../components/Catalog/FilterOptions";
import { catalogResponse } from "../../types/CatalogTypes";

interface catalogProps {
    catalogData: catalogResponse
}

const catalog: FC<catalogProps> = function shop({
    catalogData
}) {
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
                                return (
                                    <Col md={3} sm={6} key={item.id} >
                                        <CatalogItem itemPreview={item} />
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export async function getStaticProps() {
    const res = await fetch('http://localhost:3000/api/get/catalog/getFullCatalog');
    const catalogData = await res.json();
    return {
        props: {catalogData},
    }
}

export default catalog;