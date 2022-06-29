import { authOptions } from '../../auth/[...nextauth]';
import { unstable_getServerSession } from "next-auth/next";
import clientPromise from '../../../../lib/mongodb';
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';
import { DndProvider } from 'react-dnd';

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
    // search for _id of user
    const getUserID = session.user;

    const testDatabase = connection.db('test');
    const users = testDatabase.collection('users');

    const user = await users.findOne(getUserID);

    // search savedItems table
    const getSavedItems = {
        owner: user._id,
        name: "Saved Items"
    }

    const shopBuilder = connection.db('shopBuilder');
    const savedItemsCollection = shopBuilder.collection('savedItems');

    const savedItemsList = await savedItemsCollection.findOne(getSavedItems);
    if (!savedItemsList) { // no saved items
        return res.status(200).json({
            savedItems: {},
        })
    }
    const idObjs = savedItemsList.itemIDs.map((id: string) => {
        return (new ObjectId(id));
    });

    // get the website stack from the database
    const getWebsiteStackPartial = {
        owner: user._id,
        title: "First Website"
    }
    const websiteStackCollection = shopBuilder.collection('websiteStack');
    const websiteStackPartial = await websiteStackCollection.findOne(getWebsiteStackPartial);

    // get actual items from the catalog
    const catalogCollection = shopBuilder.collection('catalog');
    const cursor = catalogCollection.find({
        _id: { $in: idObjs },
        itemType: "widget"
    });
    if (!cursor) { // no saved items
        return res.status(200).json({
            websiteStack: {
                widgetLibrary: {
                    title: "Saved Widgets",
                    widgetIds: [],
                    data: {}
                }
            },
        })
    }

    const savedWidgetDocs = await cursor.toArray();
    const dataObj = {}
    savedWidgetDocs.forEach(doc => {
        let temp= String(doc._id.valueOf());
        dataObj[temp] = doc;
    });

    // saved items section to be sent to client
    const savedWidgets = {
        title: "Saved Widgets",
        itemIds: savedItemsList.itemIDs,
        data: dataObj
    }

    // putting the stack together
    const websiteStack = {
        widgetsLibrary: savedWidgets,
        ...websiteStackPartial
    }

    // console.log("\nsaved Widget\n", savedWidgets);
    // console.log("\nthe website stack\n", websiteStack);

    return res.status(200).json({ websiteStack: websiteStack })
}
