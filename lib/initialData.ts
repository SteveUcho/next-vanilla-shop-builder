import { WebsiteState } from "../types/WebBuilderStateTypes";
import { v4 as uuid } from "uuid";

const columnID1 = uuid();

const initialData: WebsiteState = {
    widgetsLibrary: {
        title: 'Widgets',
        widgetIds: ['widget-1', 'widget-2', 'widget-3'],
        data: {
            'widget-1': {
                id: 'widget-1',
                name: 'photo gallery',
                widgetType: 'basic',
                propertyInputs:[
                    {
                        name: "Photo URL",
                        type: "textarea",
                        data: "some cat vid"
                    }
                ]
            },
            'widget-2': {
                id: 'widget-2',
                name: 'paragraph',
                widgetType: 'basic',
                propertyInputs:[
                    {
                        name: "Photo URL",
                        type: "textarea",
                        data: "some cat vid"
                    }
                ]
            },
            'widget-3': {
                id: 'widget-3',
                name: 'footer',
                widgetType: 'basic',
                propertyInputs:[
                    {
                        name: "Photo URL",
                        type: "textarea",
                        data: "some cat vid"
                    }
                ]
            },
        },
    },
    widgets: {
        'something-1': {
            key: "something-1",
            id: 'widget-1',
            name: 'photo gallery',
            widgetType: 'basic',
            propertyInputs:[
                {
                    name: "Photo URL",
                    type: "textarea",
                    data: "some cat vid"
                }
            ]
        },
        'something-2': {
            key: "something-2",
            id: 'widget-2',
            name: 'paragraph',
            widgetType: 'basic',
            propertyInputs:[
                {
                    name: "Photo URL",
                    type: "textarea",
                    data: "some cat vid"
                }
            ]
        },
    },
    columns: {
        websiteStack: {
            id: columnID1,
            title: 'Website',
            widgetKeys:["something-1", "something-2"],
        },
    },
};

export default initialData;