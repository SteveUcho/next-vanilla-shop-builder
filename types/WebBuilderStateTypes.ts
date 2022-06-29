export interface WidgetTemplate {
    id: string
    name: string
    widgetType: string
}

export interface Column {
    id: string
    title: string
    widgetKeys: string[]
}

export interface Widget extends WidgetTemplate {
    key: string
    columns?: string[]
}

export interface WidgetsLibrary {
    title: string
    widgetIds: string[]
    data: Record<string, WidgetTemplate>
}

export interface WebsiteState {
    widgetsLibrary: WidgetsLibrary,
    widgets: Record<string, Widget>,
    columns: Record<string, Column>
}