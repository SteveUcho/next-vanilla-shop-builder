interface WidgetTemplate {
    id: string
    content: string
    type: string
}

export interface Column {
    key: string
    id: string
    title: string
    widgetKeys: string[]
}

export interface Widget extends WidgetTemplate {
    key: string
    columns?: string[]
}

export interface WebsiteState {
    widgetsLibrary: {
        title: string
        widgetIds: string[]
        data: Record<string, WidgetTemplate>
    },
    widgets: Record<string, Widget>,
    columns: Record<string, Column>
}