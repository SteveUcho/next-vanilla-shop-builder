import { widgetIDsResponse } from "../../../../../types/CatalogTypes"

export default (req, res) => {
    const temp: widgetIDsResponse = {
        widgetIDs: [
            "dfiungjgr3123",
            "jknjlm6782",
            "ytgvbh674"
        ]
    }
    res.status(200).json(temp);
}
