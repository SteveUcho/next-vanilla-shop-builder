import React from "react";
import styles from './WidgetDisplay.module.css';
import { Droppable } from "react-beautiful-dnd";

export default class WidgetColumn extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.title}>{this.props.column.title}</div>
                <Droppable droppableId={this.props.column.id}>
                    {(provided, snapshot) => (
                        <div
                            className={styles.widgetsList}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{backgroundColor: (snapshot.isDraggingOver ? 'lightgreen' : 'white')}}
                        >
                            {this.props.children}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    }
}