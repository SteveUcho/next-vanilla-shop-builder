import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { widgetID } = req.query;
    const widgetIDObj = new ObjectId(String(widgetID));

    const connection = await clientPromise;
    


    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');

    //check creator of code
    const checkQuery = {
        _id: widgetIDObj
    }
    const creatorRes = await catalogCollection.findOne(checkQuery)
    if (creatorRes.creatorID !== widgetIDObj) {
        return res.status(403).json({message: "You are not allowed to do this."})
    }

    // update the code
    const updateQuery = {
        _id: widgetIDObj
    }
    const updateRes = await catalogCollection.updateOne(
        updateQuery,
        {
            $set: {
                "code": req.body.code,
            },
        },
    );

    if (updateRes.matchedCount === 0) {
        return res.status(400).json({
            message: 'No such component exists.',
        });
    }

    return res.status(200).json({
        message: 'Success',
    });
}
