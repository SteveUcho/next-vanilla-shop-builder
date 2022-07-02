import { FC, useEffect } from 'react'
import { memo } from 'react'
import { useDrag } from 'react-dnd'
import styles from './Widgets.module.scss';
import { v4 as uuid } from 'uuid';

import { ItemTypes } from '../../types/ItemTypes'
import { SelectInput, TextAreaInput, Widget } from '../../types/WebBuilderStateTypes';
import { Button, FloatingLabel, Form } from 'react-bootstrap';

export interface BasicWidgetProps {
    widget: Widget
    index: number
    containerId: string
    removeWidget: (widgetType: string, widgetKey: string, containerID: string, index: number) => void
    updateState: (widgetKey: string, propety: any, index: number, event) => void
}

const BasicWidget: FC<BasicWidgetProps> = memo(function BasicWidget({
    index,
    containerId,
    widget,
    removeWidget,
    updateState
}) {

    const [{ opacity }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.WIDGET,
            item: { key: widget.key, index, containerId },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [widget.key, index],
    )

    function removeHelper() {
        removeWidget("basic", widget.key, containerId, index);
    }

    function handlePropetyChange(propety: TextAreaInput | SelectInput, index: number) {
        return (e) => {
            updateState(widget.key, propety, index, e.target.value);
        }
    }

    return (
        <div
            ref={preview}
            style={{ opacity }}
            className={styles.basicWidget}
        >
            <div ref={drag} className={styles.widgetTitle}>
                <h2>{widget.name}</h2>
                {"key: " + widget.key + "  "}
                <Button onClick={removeHelper} variant="danger">Delete</Button>
            </div>
            <div className={styles.widgetProperties}>
                {
                    widget.propertyInputs.map((property, indexX) => {
                        switch (property.type) {
                            case "textarea":
                                return (
                                    <div key={property.name + indexX}>
                                        <h4>{property.name}</h4>
                                        <Form.Control as="textarea" value={property.data} onChange={handlePropetyChange(property, indexX)}/>
                                    </div>
                                )
                            case "select":
                                return (
                                    <FloatingLabel key={property.name + indexX} controlId="floatingSelect" label={property.name}>
                                        <Form.Select aria-label={"select form for property " + property.name} onChange={handlePropetyChange(property, indexX)} value={property.choice}>
                                            {
                                                property.options.map((option, indexY) => {
                                                    return <option key={option + indexX + indexY} value={indexY}>{option}</option>
                                                })
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                )
                        }
                    })
                }
            </div>
        </div>
    )
})

export default BasicWidget;
