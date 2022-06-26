import type { FC } from 'react';
import React from 'react';
import { ItemPreiew } from '../../types/CatalogTypes';
import styles from './Catalog.module.scss'

interface CatalogItemProps {
    itemPreview: ItemPreiew
}

const CatalogItem: FC<CatalogItemProps> = function CatalogItem({
    itemPreview
}) {
    const itemURL = "url(" + itemPreview.imageLink + ")"
    const anchorLinkRef = React.useRef(null)

    function anchorLinkHelper(item: ItemPreiew) {
        let tempString;
        if (item.tags[0] === "Widget") {
            tempString = '/catalog/widgets/' + itemPreview.id;
        }
        return (
            <h3 className={styles.itemName}><a href={tempString} ref={anchorLinkRef}>{itemPreview.name}</a></h3>
        )
    }

    function itemClickHandler() {
        anchorLinkRef.current.click()
    }

    return (
        <div className={styles.catalogItem} onClick={itemClickHandler}>
            <div className={styles.itemBackground} style={{backgroundImage: itemURL}} />
            <div className={styles.itemProperties}>
                <div>
                    { anchorLinkHelper(itemPreview) }
                </div>
                <div>
                    <p>{itemPreview.blurb}</p>
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