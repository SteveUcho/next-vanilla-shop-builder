import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styles from './BasicWidget.module.scss';

export default class BasicWidget extends React.Component {
    render () {
        return (
            <Draggable draggableId={this.props.widget.key} index={this.props.index}>
                {(provided, snapshot) => (
                    <div className={styles.widget}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        {this.props.widget.content}
                    </div>
                )}
            </Draggable>
        );
    }
}