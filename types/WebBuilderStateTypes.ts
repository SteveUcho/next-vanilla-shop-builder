interface InputType {
    name: string
}

export interface TextAreaInput extends InputType{
    type: "textarea"
    data: string
}

export interface SelectInput extends InputType {
    type: "select"
    options: string[]
    choice: number
}

export interface WidgetTemplate {
    id: string
    name: string
    widgetType: "basic" | "parent"
    propertyInputs: (TextAreaInput | SelectInput)[]
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