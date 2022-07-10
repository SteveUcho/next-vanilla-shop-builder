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

    if (!session) {
        console.log("not signed in");
        res.status(401).json({ message: "You must be logged in." });
        return;
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

    if (!savedItems) { // no saved items
        return res.status(200).json({
            savedItems: [],
        })
    }

    return res.status(200).json({savedItems: savedItems.itemIDs})
}
