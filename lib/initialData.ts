import { WebsiteState } from "../types/WebBuilderStateTypes";
import { v4 as uuid } from "uuid";

const initialData: WebsiteState = {
    widgetsLibrary: {
        id: 'widgetsLibrary',
        title: 'Widgets',
        widgetIds: ['widget-1', 'widget-2', 'widget-3'],
        data: {
            'widget-1': { id: 'widget-1', content: 'photo gallery', type: 'basic' },
            'widget-2': { id: 'widget-2', content: 'paragraph', type: 'basic' },
            'widget-3': { id: 'widget-3', content: 'footer', type: 'basic' },
        },
    },
    widgets: {
        'something-1': { key: "something-1", id: 'widget-1', content: 'photo gallery', type: 'basic' },
        'something-2': { key: "something-2", id: 'widget-2', content: 'paragraph', type: 'basic' },
        'something-3': {
            key: "something-3",
            id: 'widget-3',
            content: 'Multi Column',
            type: 'parent',
            columns: ['left33', 'mid33']
        },
        'something-4': {
            key: "something-4",
            id: 'widget-4',
            content: 'Multi Column',
            type: 'parent',
            columns: ['catch22']
        },
        'thing-1': { key: "thing-1", id: 'widget-4', content: 'photo gallery', type: 'basic' },
        'thing-2': { key: "thing-2", id: 'widget-5', content: 'photo gallery', type: 'basic' },
        'stuff-1': { key: "stuff-1", id: 'widget-6', content: 'photo gallery', type: 'basic' },
        'stuff-2': { key: "stuff-2", id: 'widget-7', content: 'photo gallery', type: 'basic' },
    },
    columns: {
        websiteStack: {
            key: uuid(),
            id: 'websiteStack',
            title: 'Website',
            widgetKeys:["something-1", "something-2", "something-3"],
        },
        catch22: {
            key: uuid(),
            id: "catch22",
            title: "catch22",
            widgetKeys: ["stuff-1", "stuff-2"]
        },
        left33: {
            key: uuid(),
            id: "left33",
            title: "left33",
            widgetKeys: ['thing-1', "something-4"],
        },
        mid33: {
            key: uuid(),
            id: "mid33",
            title: "mid33",
            widgetKeys: ['thing-2'],
        }
    },
};

export default initialData;