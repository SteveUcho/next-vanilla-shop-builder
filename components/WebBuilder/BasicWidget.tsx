import type { FC } from 'react'
import { memo } from 'react'
import { useDrag} from 'react-dnd'
import styles from './Widgets.module.scss';

import { ItemTypes } from '../../types/ItemTypes'
import { Widget } from '../../types/WebBuilderStateTypes';
import { Button } from 'react-bootstrap';

export interface BasicWidgetProps {
    widget: Widget
    index: number
    containerId: string
    removeWidget: (containerID: string, index: number) => void
}

const BasicWidget: FC<BasicWidgetProps> = memo(function BasicWidget({
    index,
    containerId,
    widget,
    removeWidget
}) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.WIDGET,
            item: { key: widget.key, index, containerId },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [widget.key, index],
    )

    const opacity = isDragging ? 0 : 1

    function removeHelper() {
        removeWidget(containerId, index);
    }

    return (
        <div
            ref={drag}
            style={{ opacity }}
            className={styles.basicWidget}
        >
            { widget.name }
            { "key: " + widget.key }
            { "  " }
            <Button onClick={removeHelper}>Delete</Button>
        </div>
    )
})

export default BasicWidget;
