import type { FC } from "react";
import { Container } from "react-bootstrap";
import { singleItemResponse, widgetIDsResponse } from '../../../types/CatalogTypes';
import styles from '../../../styles/CatalogItem.module.scss';

interface catalogItemProps {
    fullItem: singleItemResponse
}

const catalogItem: FC<catalogItemProps> = function catalogItem({ fullItem }) {
    function saveItemHandler() {
        fetch('http://localhost:3000/api/post/saveItem')
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return (
        <Container>
            <div className={styles.imageContainer} style={{backgroundImage: 'URL(' + fullItem.imageURL + ')'}}>
            </div>
            <h1>{fullItem.name}</h1>
            <button onClick={saveItemHandler}>Save Item</button>
            <hr />
            <h2>Summary</h2>
            <p>{fullItem.summary}</p>
        </Container>
    )
}

export async function getStaticPaths() {
    const res = await fetch('http://localhost:3000/api/get/catalog/items/getWidgetIDs');
    const idList: widgetIDsResponse = await res.json();
    const resObj = idList.widgetIDs.map((id: string) => {
        return ({
            params: {
                id: id
            }
        })
    })

    return {
        paths: resObj,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const res = await fetch('http://localhost:3000/api/get/catalog/items/' + params.id);
    const fullItem = await res.json()
    return {
        props: {
            fullItem
        }
    }
}

export default catalogItem;
