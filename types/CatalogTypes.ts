export interface filterCategory {
    name: string
    type: string
    options?: string[]
}

export interface ItemPreiew {
    _id: string
    name: string
    imageURL: string
    tags: string[]
    summary: string
    itemType: string
    creatorID: string
}

export interface PageItem {
    _id: string
    name: string
    imageURL: string
    tags: string[]
    summary: string
    itemType: string
    // more to come
    widgetType?: string
    fontType?: string
}

export interface catalogResponse {
    filterCategories: filterCategory[]
    items: ItemPreiew[]
}

export interface widgetIDsResponse {
    widgetIDs: string[]
}

export interface singleItemResponse {
    item: PageItem
}

export interface savedItemsResponse {
    savedItems: string[] // to be converted to set
}