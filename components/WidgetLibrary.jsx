import React from "react";
import styles from './WidgetDisplay.module.css';
import { Droppable } from "react-beautiful-dnd";
import WidgetClone from "./WidgetClone";

export default class WidgetLibrary extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.title}>{this.props.column.title}</div>
                <Droppable droppableId="ITEMS" isDropDisabled={true}>
                    {(provided, snapshot) => (
                        <div className={styles.widgetsList} ref={provided.innerRef} {...provided.droppableProps}>
                            {this.props.widgets.map((widget, index) => (
                                <WidgetClone key={widget.id} widget={widget} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    }
}