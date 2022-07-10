import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { widgetID } = req.query;
    const widgetIDObj = new ObjectId(widgetID)

    const connection = await clientPromise;

    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');

    // check creator of code
    const checkQuery = {
        _id: widgetIDObj
    }
    const creatorRes = await catalogCollection.findOne(checkQuery)
    if (creatorRes.creatorID !== widgetIDObj) {
        return res.status(403).json({message: "You are not allowed to do this."})
    }

    // find the item
    const query = {
        _id: widgetIDObj
    }
    const fullItem = await catalogCollection.findOne(query);

    res.status(200).json(fullItem);
}
