import { authOptions } from '../../auth/[...nextauth]';
import { unstable_getServerSession } from "next-auth/next";
import clientPromise from '../../../../lib/mongodb';
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await unstable_getServerSession(req, res, authOptions);
    const { widgetID } = req.query;
    const widgetIDObj = new ObjectId(String(widgetID))

    if (!session) {
        console.log("not signed in");
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    const connection = await clientPromise;

    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');

    // check creator of code
    const checkQuery = {
        _id: widgetIDObj
    }
    const creatorRes = await catalogCollection.findOne(checkQuery)
    if (creatorRes.creatorID.toString() !== session.user.id) {
        console.log(creatorRes.creatorID, session.user.id);
        return res.status(403).json({message: "You are not allowed to do this."});
    }

    // find the item
    const query = {
        _id: widgetIDObj
    }
    const fullItem = await catalogCollection.findOne(query);

    res.status(200).json(fullItem);
}
