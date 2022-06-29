import type { FC } from 'react';
import React from 'react';
import { Button } from 'react-bootstrap';
import { ItemPreiew } from '../../types/CatalogTypes';
import styles from './Catalog.module.scss';

interface CatalogItemProps {
    itemPreview: ItemPreiew
    saved: boolean
    stateHandler: any
}

const CatalogItem: FC<CatalogItemProps> = function CatalogItem({
    itemPreview,
    saved,
    stateHandler
}) {
    const itemURL = "url(" + itemPreview.imageURL + ")"
    const anchorLinkRef = React.useRef(null)

    function saveItemHandler() {
        const temp = {
            id: itemPreview._id
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
        stateHandler(itemPreview._id, saved);
    }

    return (
        <div className={styles.catalogItem}>
            <div className={styles.itemBackground} style={{ backgroundImage: itemURL }} />
            <div className={styles.itemProperties}>
                <div>
                    <h3 className={styles.itemName}><a href={'/catalog/items/' + itemPreview._id} ref={anchorLinkRef}>{itemPreview.name}</a></h3>
                </div>
                <div>
                    <Button onClick={saveItemHandler} variant={saved ? "success" : "primary" }>{saved ? "Saved" : "Save Item"}</Button>
                    <p>{itemPreview.summary}</p>
                </div>
                <div className={styles.itemTags}>
                    {itemPreview.tags.map((tag, index) => {
                        return <span key={tag + index} className={styles.itemTag}>{tag}</span>
                    })}
                </div>
            </div>
        </div>
    )
}

export default CatalogItem;