import type { FC, ReactNode } from "react";
import React, { Children } from 'react';
import { Col, Row } from "react-bootstrap";
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
    children: ReactNode
}

const MultiColumnWidget: FC<MultiColumnWidgetProps> = function MultiColumnWidget({
    uniqueKey,
    widget,
    index,
    containerId,
    children,
}) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.ROW,
            item: { key: uniqueKey, index, containerId },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [uniqueKey, index],
    )

    const opacity = isDragging ? 0 : 1

    return (
        <div
            ref={drag} 
            style={{ opacity }}
            className={styles.multiColumnWidget}
        >
            <div className={moreStyles.title}>
                { widget.content }
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
