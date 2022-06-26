import type { FC } from 'react'
import { memo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styles from './Widgets.module.scss';

import { ItemTypes } from '../../types/ItemTypes'
import { Widget } from '../../types/WebBuilderStateTypes';

export interface BasicWidgetProps {
    uniqueKey: string
    widget: Widget
    index: number
    containerId: string
}

const BasicWidget: FC<BasicWidgetProps> = memo(function BasicWidget({
    uniqueKey,
    index,
    containerId,
    widget,
}) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.WIDGET,
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
            key={uniqueKey}
            ref={drag}
            style={{ opacity }}
            className={styles.basicWidget}
        >
            { widget.content }
        </div>
    )
})

export default BasicWidget;
