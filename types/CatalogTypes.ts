export interface filterCategory {
    name: string
    type: string
    options?: string[]
}

export interface ItemPreiew {
    id: string
    name: string
    imageLink: string
    tags: string[]
    blurb: string
}

export interface catalogResponse {
    filterCategories: filterCategory[]
    items: ItemPreiew[]
}

export interface widgetIDsResponse {
    widgetIDs: string[]
}

export interface singleItemResponse {
    id: string
    name: string
    imageURL: string
    tags: string[]
    itemType: string
    summary: string
}