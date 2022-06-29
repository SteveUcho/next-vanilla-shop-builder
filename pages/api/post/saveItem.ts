import { authOptions } from '../auth/[...nextauth]';
import { unstable_getServerSession } from "next-auth/next";
import clientPromise from '../../../lib/mongodb';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id: itemID } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
        console.log("not signed in");
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    const connection = await clientPromise;
    // search for _id of user
    const getUserID = session.user;

    const testDatabase = connection.db('test');
    const users = testDatabase.collection('users');

    const user = await users.findOne(getUserID);
    console.log(user);

    // search savedItems table
    const getSavedItems = {
        owner: user._id,
        name: "Saved Items"
    }

    const shopBuilder = connection.db('shopBuilder');
    const savedItemsCollection = shopBuilder.collection('savedItems');

    const savedItems = await savedItemsCollection.findOne(getSavedItems);

    if (!savedItems) { // insert document into savedItems table
        await savedItemsCollection.insertOne({
            owner: user._id,
            name: "Saved Items",
            itemIDs: [itemID],
        });

        return res.status(200).json({
            message: 'Success',
        })
    }

    if (savedItems.itemIDs.includes(itemID)) {
        await savedItemsCollection.updateOne(
            { _id: savedItems._id },
            { $pull: { itemIDs: itemID } }
        );
    } else{
        await savedItemsCollection.updateOne(
            { _id: savedItems._id },
            { $push: { itemIDs: itemID } }
        );
    }

    return res.status(200).json({
        message: 'Success',
    })
}
