import React, { FC, ReactNode } from "react";
import { Column } from "../../types/WebBuilderStateTypes";
import styles from './WidgetDisplay.module.css';

interface WidgetColumnProps {
    uniqueKey: string
    column: Column
    children: ReactNode
}

const WidgetColumn: FC<WidgetColumnProps> = function WidgetColumn({
    uniqueKey,
    column,
    children
}) {
    return (
        <div key={uniqueKey} className={styles.container}>
            <div className={styles.title}>
                {column.title}
            </div>
            <div className={styles.widgetsList}>
                {children}
            </div>
        </div>
    );
};

export default WidgetColumn;
