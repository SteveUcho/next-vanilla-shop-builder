import { singleItemResponse } from "../../../../../types/CatalogTypes"

const store: Record<string, singleItemResponse> = {
    'dfiungjgr3123': {
        id: 'dfiungjgr3123',
        itemType: "widget",
        name: "Paragraph",
        imageURL: "https://i.natgeofe.com/n/46b07b5e-1264-42e1-ae4b-8a021226e2d0/domestic-cat_thumb_square.jpg",
        tags: ["Widget", "basic"],
        summary: "This is an area where you can write a lot of stuff"
    }
}

function getItem(itemID: string): singleItemResponse {
    return store[itemID]
}

export default (req, res) => {
    const { id } = req.query;
    const temp = getItem(id);
    res.status(200).json(temp);
}
