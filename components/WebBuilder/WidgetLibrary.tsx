import React from "react";
import styles from './WidgetDisplay.module.css';
import WidgetClone from "./WidgetClone";

export default class WidgetLibrary extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.title}>{this.props.column.title}</div>
                    <div className={styles.widgetsList}>
                        {this.props.widgets.map((widget, index) => (
                            <WidgetClone key={widget.id} widget={widget} index={index} />
                        ))}
                    </div>
            </div>
        );
    }
}