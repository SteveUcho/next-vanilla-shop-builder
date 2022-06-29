import type { FC } from "react";
import { WidgetTemplate } from "../../types/WebBuilderStateTypes";
import styles from './Widgets.module.scss'

import { ItemTypes } from '../../types/ItemTypes';
import { useDrag } from "react-dnd";


interface WidgetCloneProps {
    widget: WidgetTemplate
    index: number
}

const WidgetClone: FC<WidgetCloneProps> = function WidgetClone({
    widget,
    index
}) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.CLONE,
            item: { key: widget.id, index, containerId: "widgetsLibrary" },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [widget.id, index],
    )

    return (
        <div
            ref={drag}
            key={widget.id}
            className={styles.clone}
        >
            {widget.name}
        </div>
    );
}

export default WidgetClone;
