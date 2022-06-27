import { authOptions } from '../auth/[...nextauth]';
import { unstable_getServerSession } from "next-auth/next";
import clientPromise from '../../../lib/mongodb';
import { singleItemResponse } from "../../../types/CatalogTypes";
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    const connection = await clientPromise;
    const testDatabase = connection.db('test');
    const movies = testDatabase.collection('users');
    // Query for a movie that has the title 'Back to the Future'
    const query = session.user;
    const user = await movies.findOne(query);
    console.log(user);

    return res.status(200).json({
        message: 'Success',
    })
}
