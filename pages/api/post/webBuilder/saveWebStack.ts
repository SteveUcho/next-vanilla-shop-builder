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
    const { stack: websiteStackBody } = req.body;

    if (!session) {
        console.log("not signed in");
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    const connection = await clientPromise;

    const shopBuilderDB = connection.db('shopBuilder');
    const websiteStackCollection = shopBuilderDB.collection('websiteStack');

    //check creator of code
    const checkQuery = {
        _id: new ObjectId(websiteStackBody._id)
    }
    const ownerRes = await websiteStackCollection.findOne(checkQuery)
    if (ownerRes.owner.toString() !== session.user.id) {
        return res.status(403).json({message: "You are not allowed to do this."})
    }
    
    // update the code
    const updateQuery = {
        _id: new ObjectId(websiteStackBody._id)
    }
    const updateRes = await websiteStackCollection.updateOne(
        updateQuery,
        {
            $set: {
                "widgets": websiteStackBody.widgets,
                "columns": websiteStackBody.columns
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
