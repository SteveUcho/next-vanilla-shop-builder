import { catalogResponse } from "../../../../types/CatalogTypes";
import clientPromise from '../../../../lib/mongodb';

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
    items: [
        {
            id: "dfiungjgr3123",
            name: "Paragraph",
            imageLink: "https://i.natgeofe.com/n/46b07b5e-1264-42e1-ae4b-8a021226e2d0/domestic-cat_thumb_square.jpg",
            tags: ["Widget", "Basic"],
            blurb: "Creates text area for writing anything"
        },
        {
            id: "jknjlm6782",
            name: "Neuhaus",
            imageLink: "https://i.natgeofe.com/n/46b07b5e-1264-42e1-ae4b-8a021226e2d0/domestic-cat_thumb_square.jpg",
            tags: ["Font", "Basic"],
            blurb: "Fancy font for website"
        },
        {
            id: "ytgvbh674",
            name: "Multi Column Widget",
            imageLink: "https://i.natgeofe.com/n/46b07b5e-1264-42e1-ae4b-8a021226e2d0/domestic-cat_thumb_square.jpg",
            tags: ["Widget", "Parent"],
            blurb: "Create a row of widgets wtih this widget"
        },
    ]
}

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
