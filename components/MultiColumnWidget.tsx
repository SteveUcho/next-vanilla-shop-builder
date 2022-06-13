import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Col, Container, Row } from "react-bootstrap";
import styles from './BasicWidget.module.scss';

export default class MultiColumnWidget extends React.Component {
    render () {
        return (
            <Draggable draggableId={this.props.widget.key} index={this.props.index}>
                {(provided, snapshot) => (
                    <div className={styles.widget}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        style={ {...provided.draggableProps.style, "backgroundColor": (snapshot.isDragging ? 'blue' : 'white')} }
                    >
                        <div>
                            {this.props.widget.content}
                        </div>
                        <Container fluid style={{padding: 0}}>
                            <Row>
                                {React.Children.map(this.props.children, child => {
                                    return (<Col>
                                                { child }
                                            </Col>)
                                })}
                            </Row>
                        </Container>
                        {/* { this.props.children } */}
                    </div>
                )}
            </Draggable>
        );
    }
}