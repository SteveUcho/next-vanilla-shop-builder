import { FC, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { PageItem, widgetIDsResponse } from '../../../types/CatalogTypes';
import styles from '../../../styles/CatalogItem.module.scss';

interface catalogItemProps {
    pageItem: PageItem
}

const catalogItem: FC<catalogItemProps> = function catalogItem({ pageItem }) {
    const [saved, setSavedSate] = useState(false);

    useEffect(() => {
        const fetchInitData = async () => {
            const tempRes = await fetch('http://localhost:3000/api/get/isItemSaved/' + pageItem._id);
            const res = await tempRes.json();
            setSavedSate(res.isItemSaved);
        }
        fetchInitData();
    }, [])

    function saveItemHandler() {
        const temp = {
            id: pageItem._id
        };
        fetch('http://localhost:3000/api/post/saveItem', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(temp),
        })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <Container>
            <div className={styles.imageContainer} style={{ backgroundImage: 'URL(' + pageItem.imageURL + ')' }}>
            </div>
            <h1>{pageItem.name}</h1>
            <Button onClick={saveItemHandler} variant={saved ? 'success' : 'primary'}>{saved ? "Saved" : "Save Item"}</Button>
            <hr />
            <h2>Summary</h2>
            <p>{pageItem.summary}</p>
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
    const pageItemObj = await res.json();
    const pageItem = pageItemObj.item;
    return {
        props: {
            pageItem
        }
    }
}

export default catalogItem;
