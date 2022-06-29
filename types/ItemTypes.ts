export const ItemTypes = {
    WIDGET: 'widget',
    ROW: 'row',
    CLONE: 'clone'
}

export interface WidgetItem {
    key: string
    index: number
    containerId: string
}