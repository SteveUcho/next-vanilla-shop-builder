import { widgetIDsResponse } from "../../../../../types/CatalogTypes";
import clientPromise from '../../../../../lib/mongodb';

export default async function handler(req, res) {
    
    const connection = await clientPromise;
    
    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');

    const tempIDs = catalogCollection.find({}).project({_id: 1});
    const itemIDs = await tempIDs.toArray();

    const resIDs = itemIDs.map((idObj) =>{
        return idObj._id.valueOf();
    });
    
    const temp: widgetIDsResponse = {
        widgetIDs: resIDs
    }

    res.status(200).json(temp);
}
