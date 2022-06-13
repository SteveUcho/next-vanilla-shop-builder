import { Button, Col, Container, Row } from "react-bootstrap";
import NavBar from "../components/NavBar";
import BasicWidget from '../components/BasicWidget';
import initialData from "../lib/initialData";
import { DragDropContext, resetServerContext } from "react-beautiful-dnd";
import React from "react";
import { v4 as uuid } from 'uuid';

import WidgetColumn from "../components/WidgetColumn";
import WidgetLibrary from "../components/WidgetLibrary";
import MultiColumnWidget from "../components/MultiColumnWidget";

class WebBuilder extends React.Component {
    state = initialData;
    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
    
        return result;
    };

    copy = (source: string[], destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination.widgetKeys);
        const newKey = uuid()
        const item = {
            ...this.state.widgetsLibrary.data[sourceClone[droppableSource.index]],
            key: newKey
        };
        destClone.splice(droppableDestination.index, 0, newKey);
        const res = {
            ...this.state,
            websiteStack: {
                ...this.state.websiteStack,
                data: {
                    ...this.state.websiteStack.data,
                    [newKey]: item
                },
            }
        };
        const temp = res[destination.id]
        res[destination.id] = {
            ...temp,
            widgetKeys: destClone
        }
        console.log(res)
        return temp
    };
    
    move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source.widgetKeys);
        const destClone = Array.from(destination.widgetKeys);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
    
        destClone.splice(droppableDestination.index, 0, removed);
    
        return {
            ...this.state,
            [source.id]: {
                ...source,
                widgetKeys: sourceClone
            },
            [destination.id]: {
                ...destination,
                widgetKeys: destClone
            }
        };
    };
    submitWebsite = () => {
        console.log(this.state.websiteStack.widgetKeys)
    }
    onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (!destination) {
            return;
        }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    ...this.state,
                    websiteStack: {
                        ...this.state.websiteStack,
                        widgetKeys: this.reorder(
                            this.state.websiteStack.widgetKeys,
                            source.index,
                            destination.index
                        )
                    }
                });
                break;
            case 'ITEMS':
                this.setState(
                    this.copy(
                        this.state.widgetsLibrary.widgetIds,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                );
                break;
            default:
                this.setState(
                    this.move(
                        this.state[source.droppableId],
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                );
                break;
        }
    }

    createColumn(root) {
        const currColumn = root
        const widgets = currColumn.widgetKeys.map((widgetKey, index) => {
            const currWidget = this.state.websiteStack.data[widgetKey];
            if (currWidget.type === "parent") {
                const  newColumns = currWidget.columns.map(columnKey => {
                    return this.createColumn(this.state[columnKey])
                });
                return (<MultiColumnWidget key={currWidget.key} widget={currWidget} index={index}>
                            { newColumns }
                        </MultiColumnWidget>)
            }
            else {
                return <BasicWidget key={currWidget.key} widget={currWidget} index={index} />
            }
        });
        return (<WidgetColumn key={currColumn.id} column={currColumn}>
                    { widgets }
                </WidgetColumn>)
    }

    render() {
        return (
            <div className="App">
                <NavBar />
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Container fluid>
                        <Row>
                            <Col md={3}>
                                {
                                    [0].map(() => {
                                        const column = this.state.widgetsLibrary;
                                        const widgets = column.widgetIds.map(widgetIds => this.state.widgetsLibrary.data[widgetIds]);

                                        return <WidgetLibrary key={column.id} column={column} widgets={widgets}/>
                                    })
                                }
                            </Col>
                            <Col md={9}>
                                {this.createColumn(this.state.websiteStack)}
                                <Button onClick={this.submitWebsite}> Submit </Button>
                            </Col>
                        </Row>
                    </Container>
                </DragDropContext>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                    crossOrigin="anonymous"
                />
            </div>
            
        );
    }
}

export async function getServerSideProps() {
    resetServerContext();
    return {
      props: {},
    }
  }
  

export default WebBuilder;
