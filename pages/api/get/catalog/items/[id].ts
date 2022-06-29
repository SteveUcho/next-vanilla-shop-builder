import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { id: itemID } = req.query;

    const connection = await clientPromise;
    const query = {
        _id: new ObjectId(itemID)
    }

    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');

    const fullItem = await catalogCollection.findOne(query)

    const handlRes = {
        item: fullItem
    }

    res.status(200).json(handlRes);
}
