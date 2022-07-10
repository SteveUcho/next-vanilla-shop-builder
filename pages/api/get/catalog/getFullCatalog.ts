import { catalogResponse } from "../../../../types/CatalogTypes";
import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
    const connection = await clientPromise;

    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');

    const tempCatalog = catalogCollection.find({}).project({ propertyInputs: 0 });
    const fullCatalog = await tempCatalog.toArray();

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
        items: fullCatalog
    }
    res.status(200).json(temp)
}
