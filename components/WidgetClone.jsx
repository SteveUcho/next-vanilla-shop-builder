import React from "react";
import styles from './WidgetClone.module.scss'
import { Draggable } from "react-beautiful-dnd";

export default class WidgetClone extends React.Component {
    render () {
        return (
            <Draggable draggableId={this.props.widget.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <>
                        <div className={styles.widget}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            {this.props.widget.content}
                        </div>
                        {snapshot.isDragging && (
                            <div className={styles.clone}>{this.props.widget.content}</div>
                        )}
                    </>
                )}
            </Draggable>
        );
    }
}