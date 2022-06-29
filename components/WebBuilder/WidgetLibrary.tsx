import type { FC } from "react";
import styles from './WidgetDisplay.module.css';
import WidgetClone from "./WidgetClone";
import { WidgetsLibrary, WidgetTemplate } from "../../types/WebBuilderStateTypes";

interface WidgetLibraryProps {
    column: WidgetsLibrary
    widgets: WidgetTemplate[]
}

const WidgetLibrary: FC<WidgetLibraryProps> = function WidgetLibrary({
    column,
    widgets
}) {
    return (
        <div className={styles.container}>
            <div className={styles.title}>{column.title}</div>
            <div className={styles.widgetsList}>
                {widgets.map((widget, index) => (
                    <WidgetClone key={widget.id} widget={widget} index={index} />
                ))}
            </div>
        </div>
    );
}

export default WidgetLibrary;
