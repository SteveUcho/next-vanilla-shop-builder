import { Button, Col, Container, Row } from "react-bootstrap";
import { memo, ReactNode, useEffect, useState } from 'react';
import type { FC } from 'react';
import BasicWidget from '../components/WebBuilder/BasicWidget';
import initialData from "../lib/initialData";
import { v4 as uuid } from 'uuid';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import WidgetColumn from "../components/WebBuilder/WidgetColumn";
import WidgetLibrary from "../components/WebBuilder/WidgetLibrary";
import MultiColumnWidget from "../components/WebBuilder/MultiColumnWidget";
import { Column, SelectInput, TextAreaInput, WebsiteState, Widget } from "../types/WebBuilderStateTypes";
import { ItemTypes, WidgetItem } from "../types/ItemTypes";
import Droppable from "../components/WebBuilder/Droppable";

const WebBuilder: FC = function WebBuilder() {
    const [globalState, setGlobalState] = useState(initialData)

    useEffect(() => {
        const getInitialData = async () => {
            const res = await fetch('http://localhost:3000/api/get/webbuilder/getWebsiteStack');
            const resJson = await res.json();
            setGlobalState(resJson.websiteStack);
        }
        getInitialData();
    }, []);

    const reorder = (key: string, containerId: string, fromIndex: number, toIndex: number) => {
        const temp = [...globalState.columns[containerId].widgetKeys]
        if (toIndex > fromIndex) {
            temp.splice(toIndex, 0, key);
            temp.splice(fromIndex, 1);
        } else {
            temp.splice(fromIndex, 1);
            temp.splice(toIndex, 0, key);
        }
        setGlobalState(
            update(globalState, {
                columns: {
                    [containerId]: {
                        widgetKeys: {$set: temp}
                    }
                }
            })
        )
    };

    const copy = (key: string, toIndex: number, toContainer: string) => {
        const newKey = uuid();
        const temp = globalState.widgetsLibrary.data[key];
        let item = {}
        if (temp.widgetType === "parent") {
            const columnID = uuid();
            item = {
                ...globalState.widgetsLibrary.data[key],
                key: newKey,
                columns: [columnID],
            };
            setGlobalState(
                update(globalState, {
                    widgets: { $merge: { [newKey]: item } },
                    columns: {
                        [toContainer]: {
                            widgetKeys: { $splice: [[toIndex, 0, newKey]] }
                        },
                        [columnID]: {$set: {
                            id: columnID,
                            title: columnID,
                            widgetKeys: []
                        }}
                    }
                })
            );
        } else {
            item = {
                ...globalState.widgetsLibrary.data[key],
                key: newKey,
            };
            setGlobalState(
                update(globalState, {
                    widgets: { $merge: { [newKey]: item } },
                    columns: {
                        [toContainer]: {
                            widgetKeys: { $splice: [[toIndex, 0, newKey]] }
                        }
                    }
                })
            );
        }
    };

    const move = (key: string, fromIndex: number, fromContainer: string, toIndex: number, toContainer: string) => {
        setGlobalState(
            update(globalState, {
                columns: {
                    [fromContainer]: {
                        widgetKeys: { $splice: [[fromIndex, 1],] }
                    },
                    [toContainer]: {
                        widgetKeys: {
                            $splice: [
                                [toIndex, 0, key],
                            ]
                        }
                    },
                }
            })
        );
    };

    const onDrop = (source: WidgetItem, destination: { index: number, containerId: string }) => {
        if (!destination) {
            return;
        }
        if (destination.containerId === source.containerId && (destination.index === source.index || source.index + 1 === destination.index)) {
            return;
        }
        switch (source.containerId) {
            case destination.containerId:
                reorder(source.key, destination.containerId, source.index, destination.index);
                break;
            case 'widgetsLibrary':
                copy(source.key, destination.index, destination.containerId);
                break;
            default:
                move(source.key, source.index, source.containerId, destination.index, destination.containerId);
                break;
        }
    };

    function removeHelper(widgetType: "basic" | "parent", widgetKey: string, fromContainer: string, fromIndex: number) {
        if (widgetType === "parent") {
            let globalTemp: WebsiteState = {...globalState};
            const tempWidgetList = [widgetKey];
            const tempColumnList = [...globalTemp.widgets[widgetKey].columns];

            for (var i = 0; i < tempColumnList.length; i++) {
                let columnID = tempColumnList[i];
                let currColumn = globalTemp.columns[columnID];
                tempWidgetList.push(...currColumn.widgetKeys);

                for (var j = 0; j < currColumn.widgetKeys.length; j++) {
                    let currWidget = globalTemp.widgets[currColumn.widgetKeys[j]];
                    if (currWidget.widgetType === "parent") {
                        tempColumnList.push(...currWidget.columns);
                    }
                }
            }

            const tempFunc = (value) => {
                const temp = {...value};
                temp[fromContainer].widgetKeys.splice(fromIndex, 1);
                tempColumnList.forEach(columnID => {
                    delete temp[columnID]
                });
                return temp;
            }

            setGlobalState(
                update(globalState, {
                    widgets: {$unset: tempWidgetList},
                    columns: {$apply: tempFunc},
                })
            );
        } else {
            setGlobalState(
                update(globalState, {
                    widgets: {$unset: [widgetKey]},
                    columns: {
                        [fromContainer]: {
                            widgetKeys: { $splice: [[fromIndex, 1],] }
                        },
                    }
                })
            );
        }
    }

    function updateWidgetProperty(widgetKey: string, property: TextAreaInput | SelectInput, index: number, value: string) {
        switch (property.type) {
            case "select":
                setGlobalState(
                    update(globalState, {
                        widgets: {
                            [widgetKey]: {
                                propertyInputs: {
                                    [index]: {
                                        choice: {$set: Number(value)}
                                    }
                                }
                            }
                        }
                    })
                );
                console.log(globalState);
                break;
            case "textarea":
                setGlobalState(
                    update(globalState, {
                        widgets: {
                            [widgetKey]: {
                                propertyInputs: {
                                    [index]: {
                                        data: {$set: value}
                                    }
                                }
                            }
                        }
                    })
                );
                break;
            default:
                break;
        }
    }

    function addColumnHelper(widgetKey: string) {
        const newColumnID = uuid();
        setGlobalState(
            update(globalState, {
                widgets: {
                    [widgetKey]: {
                        columns: {$push: [newColumnID]}
                    }
                },
                columns: {
                    [newColumnID]: {$set: {
                            id: newColumnID,
                            title: newColumnID,
                            widgetKeys: []
                        }
                    }
                }
            })
        )
    }

    function createColumn(root: Column): ReactNode {
        console.log("this is the curr state:", globalState)
        const currColumn = root;
        const widgets = currColumn.widgetKeys.map((widgetKey, index) => {
            const currWidget = globalState.widgets[widgetKey];
            if (currWidget.widgetType === "parent") {
                const newColumns = currWidget.columns.map(columnKey => {
                    return createColumn(globalState.columns[columnKey])
                });
                return (
                    <div key={currWidget.key}>
                        <Droppable index={index} containerId={currColumn.id} onDrop={onDrop} accepts={[ItemTypes.WIDGET, ItemTypes.ROW, ItemTypes.CLONE]} />
                        <MultiColumnWidget uniqueKey={currWidget.key} widget={currWidget} index={index} containerId={currColumn.id} removeWidget={removeHelper} addColumn={addColumnHelper}>
                            {newColumns}
                        </MultiColumnWidget>
                    </div>
                )
            }
            else {
                return (
                    <div key={currWidget.key}>
                        <Droppable index={index} containerId={currColumn.id} onDrop={onDrop} accepts={[ItemTypes.WIDGET, ItemTypes.ROW, ItemTypes.CLONE]} />
                        <BasicWidget index={index} containerId={currColumn.id} widget={currWidget} removeWidget={removeHelper} updateState={updateWidgetProperty} />
                    </div>
                )
            }
        });
        widgets.push(<Droppable key={currColumn.id} index={widgets.length} containerId={currColumn.id} onDrop={onDrop} accepts={[ItemTypes.WIDGET, ItemTypes.ROW, ItemTypes.CLONE]} />)
        return (
            <WidgetColumn key={currColumn.id} uniqueKey={currColumn.id} column={currColumn}>
                {widgets}
            </WidgetColumn>
        )
    };

    const submitWebsite = () => {
        console.log(globalState);
    };

    function widgetsLibraryHelper() {
        const column = globalState.widgetsLibrary;
        const widgets = column.widgetIds.map(widgetId => globalState.widgetsLibrary.data[widgetId]);

        return <WidgetLibrary column={column} widgets={widgets} />
    }

    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <Container>
                    <h1>Website Builder</h1>
                    <Row>
                        <Col md={3}>
                            {widgetsLibraryHelper()}
                        </Col>
                        <Col md={9}>
                            {createColumn(globalState.columns.websiteStack)}
                            <Button onClick={submitWebsite}> Submit </Button>
                        </Col>
                    </Row>
                </Container>
            </DndProvider>
        </div>
    );
}

export default WebBuilder;
