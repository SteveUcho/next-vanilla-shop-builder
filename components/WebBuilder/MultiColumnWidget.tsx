import type { FC, ReactNode } from "react";
import React, { Children } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";
import { Widget } from "../../types/WebBuilderStateTypes";
import styles from './Widgets.module.scss';
import moreStyles from './WidgetDisplay.module.css'

export interface MultiColumnWidgetProps {
    uniqueKey: string
    widget: Widget
    index: number
    containerId: string
    removeWidget: (widgetType: string, widgetKey: string, containerID: string, index: number) => void
    addColumn: (widgetKey: string) => void
    children: ReactNode
}

const MultiColumnWidget: FC<MultiColumnWidgetProps> = function MultiColumnWidget({
    uniqueKey,
    widget,
    index,
    containerId,
    removeWidget,
    addColumn,
    children,
}) {
    const [{ opacity }, drag] = useDrag(
        () => ({
            type: ItemTypes.ROW,
            item: { key: uniqueKey, index, containerId },
            collect: (monitor) => ({
                opacity: monitor.isDragging()? 0.4 : 1, 
            }),
        }),
        [uniqueKey, index],
    )

    function removeHelper() {
        removeWidget("parent", widget.key, containerId, index);
    }
    
    function addColumnHelper() {
        addColumn(widget.key);
    }

    return (
        <div
            ref={drag} 
            style={{ opacity }}
            className={styles.multiColumnWidget}
        >
            <div className={moreStyles.title}>
                { widget.name + "  "}
                <Button onClick={removeHelper} variant="danger">Delete</Button>
                <Button onClick={addColumnHelper} variant="success">Add Column</Button>
            </div>
            <Row>
                {
                    Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return (
                                <Col key={child.props.uniqueKey}>
                                    { child }
                                </Col>
                            )
                        }
                    })
                }
            </Row>
        </div>
    )
};

export default MultiColumnWidget;
