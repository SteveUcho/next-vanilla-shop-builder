import { authOptions } from '../auth/[...nextauth]';
import { unstable_getServerSession } from "next-auth/next";
import clientPromise from '../../../lib/mongodb';
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId, UpdateResult } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id: itemID } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
        console.log("not signed in");
        return res.status(401).json({ message: "You must be logged in." });
    }

    const connection = await clientPromise;

    // search savedItems table
    const getSavedItems = {
        owner: new ObjectId(session.user.id),
        name: "Saved Items"
    }

    const shopBuilder = connection.db('shopBuilder');
    const savedItemsCollection = shopBuilder.collection('savedItems');

    const savedItems = await savedItemsCollection.findOne(getSavedItems);

    if (!savedItems) { // insert document into savedItems table
        await savedItemsCollection.insertOne({
            owner: session.user.id,
            name: "Saved Items",
            itemIDs: [itemID],
        });

        return res.status(200).json({
            isItemSaved: true,
            didUpdate: true
        })
    }

    if (savedItems.itemIDs.includes(itemID)) {
        const temp = await savedItemsCollection.updateOne(
            { _id: savedItems._id },
            { $pull: { itemIDs: itemID } }
        );
        if (temp.modifiedCount === 0) {
            return res.status(200).json({
                isItemSaved: true,
                didUpdate: false
            })
        } else {
            return res.status(200).json({
                isItemSaved: false,
                didUpdate: true
            })
        }
    } else {
        const temp = await savedItemsCollection.updateOne(
            { _id: savedItems._id },
            { $push: { itemIDs: itemID } }
        );
        if (temp.modifiedCount === 0) {
            return res.status(200).json({
                isItemSaved: false,
                didUpdate: false
            })
        } else {
            return res.status(200).json({
                isItemSaved: true,
                didUpdate: true
            })
        }
    }
}
