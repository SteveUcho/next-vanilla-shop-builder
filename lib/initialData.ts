import { WebsiteState } from "../types/WebBuilderStateTypes";
import { v4 as uuid } from "uuid";

const columnID1 = uuid();
const columnID2 = uuid();
const columnID3 = uuid();
const columnID4 = uuid();

const initialData: WebsiteState = {
    widgetsLibrary: {
        title: 'Widgets',
        widgetIds: ['widget-1', 'widget-2', 'widget-3'],
        data: {
            'widget-1': { id: 'widget-1', name: 'photo gallery', widgetType: 'basic' },
            'widget-2': { id: 'widget-2', name: 'paragraph', widgetType: 'basic' },
            'widget-3': { id: 'widget-3', name: 'footer', widgetType: 'basic' },
        },
    },
    widgets: {
        'something-1': { key: "something-1", id: 'widget-1', name: 'photo gallery', widgetType: 'basic' },
        'something-2': { key: "something-2", id: 'widget-2', name: 'paragraph', widgetType: 'basic' },
        'something-3': {
            key: "something-3",
            id: 'widget-3',
            name: 'Multi Column',
            widgetType: 'parent',
            columns: [columnID3, columnID4]
        },
        'something-4': {
            key: "something-4",
            id: 'widget-4',
            name: 'Multi Column',
            widgetType: 'parent',
            columns: [columnID2]
        },
        'thing-1': { key: "thing-1", id: 'widget-4', name: 'photo gallery', widgetType: 'basic' },
        'thing-2': { key: "thing-2", id: 'widget-5', name: 'photo gallery', widgetType: 'basic' },
        'stuff-1': { key: "stuff-1", id: 'widget-6', name: 'photo gallery', widgetType: 'basic' },
        'stuff-2': { key: "stuff-2", id: 'widget-7', name: 'photo gallery', widgetType: 'basic' },
    },
    columns: {
        websiteStack: {
            id: columnID1,
            title: 'Website',
            widgetKeys:["something-1", "something-2", "something-3"],
        },
        [columnID2]: {
            id: columnID2,
            title: "catch22",
            widgetKeys: ["stuff-1", "stuff-2"]
        },
        [columnID3]: {
            id: columnID3,
            title: "left33",
            widgetKeys: ['thing-1', "something-4"],
        },
        [columnID4]: {
            id: columnID4,
            title: "mid33",
            widgetKeys: ['thing-2'],
        }
    },
};

export default initialData;