import React, { FC } from "react";
import { useDrop } from "react-dnd";
import { WidgetItem } from "../../types/ItemTypes";
import styles from './Droppable.module.css'

export interface Droppable {
    index: number
    containerId: string
    onDrop: (item: any, destination: { index: number, containerId: string }) => void
    accepts: string[]
}

const Droppable: FC<Droppable> = function Droppable({
    index,
    containerId,
    onDrop,
    accepts
}) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: accepts,
        drop: (item: WidgetItem, monitor) => {
            onDrop(item, { index, containerId });
        },
        canDrop: (item: WidgetItem, monitor) => {
            if (item.containerId === containerId && (item.index === index || item.index + 1 === index)) {
                return false;
            }
            return true;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    const isHovering = isOver && canDrop;

    return (
        <div
            className={styles.droppable}
            style={{backgroundColor: isHovering ? 'darkgreen' : canDrop ? 'lightgreen' : 'white'}}
            ref={drop}
        />
    );
};

export default Droppable;
