import type { FC } from 'react'
import { memo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styles from './BasicWidget.module.scss';

import { ItemTypes } from '../types/ItemTypes'

export interface BasicWidgetProps {
    id: string
    widget: object
    index: number
    containerId: string
    moveCard: (id: string, fromIndex: number, toIndex:number, fromContainer: string, toContainer: string) => void
}

interface Item {
    id: string
    index: number
    containerId: string
}

export const BasicWidget: FC<BasicWidgetProps> = memo(function BasicWidget({
    id,
    index,
    containerId,
    widget,
    moveCard,
}) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.WIDGET,
            item: { id, index, containerId },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [id, index, moveCard],
    )

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.WIDGET,
            hover({ id: draggedId, index: originalIndex, containerId: fromContainer}: Item) {
                if (draggedId !== id) {
                    moveCard(draggedId, originalIndex, index, fromContainer, containerId)
                }
            },
        }),
        [moveCard],
    )

    const opacity = isDragging ? 0 : 1
    return (
        <div
            ref={(node) => drag(drop(node))}
            style={{ opacity }}
            className={styles.widget}
        >
            { widget.content }
        </div>
    )
})
