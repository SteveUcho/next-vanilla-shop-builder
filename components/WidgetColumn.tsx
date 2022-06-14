import React from "react";
import styles from './WidgetDisplay.module.css';

export default class WidgetColumn extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.title}>{this.props.column.title}</div>
                    <div
                        className={styles.widgetsList}
                        style={{backgroundColor: (isDraggingOver ? 'lightgreen' : 'white')}}
                    >
                        {this.props.children}
                    </div>
            </div>
        );
    }
}