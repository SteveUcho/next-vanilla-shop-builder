export const ItemTypes = {
    WIDGET: 'widget',
    ROW: 'row',
}

export interface WidgetItem {
    key: string
    index: number
    containerId: string
}