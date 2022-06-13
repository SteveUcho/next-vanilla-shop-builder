const initialData = {
    widgetsLibrary: {
        id: 'column-1',
        title: 'Widgets',
        widgetIds: ['widget-1', 'widget-2', 'widget-3'],
        data: {
            'widget-1': { id: 'widget-1', content: 'photo gallery' },
            'widget-2': { id: 'widget-2', content: 'paragraph' },
            'widget-3': { id: 'widget-3', content: 'footer' },
        },
    },
    websiteStack: {
        id: 'websiteStack',
        title: 'Website',
        widgetKeys:["something-1", "something-2", "something-3"],
        data: {
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
    },
    catch22: {
        id: "catch22",
        title: "catch22",
        widgetKeys: ["stuff-1", "stuff-2"]
    },
    left33: {
        id: "left33",
        title: "left33",
        widgetKeys: ['thing-1', "something-4"],
    },
    mid33: {
        id: "mid33",
        title: "mid33",
        widgetKeys: ['thing-2'],
    }
};

export default initialData;