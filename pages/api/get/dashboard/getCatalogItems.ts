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

    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');
    const tempWidgets = catalogCollection.find({ creatorID: new ObjectId(session.user.id), itemType: "widget" });
    const userWidgets = await tempWidgets.toArray();
    const userWidgetsUpdated = userWidgets.map((userWidget) => {
        return ({
            ...userWidget,
            _id: userWidget._id.toString(),
            creatorID: userWidget.creatorID.toString()
        })
    })

    res.status(200).json({components: userWidgetsUpdated})
}