import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { Widget } from '../../../types/ComponentEditorTypes';
import useSWR from 'swr';
import { v4 as uuid } from 'uuid';
import update from 'immutability-helper';
import { TextAreaInput, SelectInput } from '../../../types/WebBuilderStateTypes';
import toast, { Toaster } from "react-hot-toast";
import { ViewUpdate } from '@codemirror/view';
import { useSession } from 'next-auth/react';

const inputOptions = {
    Textarea: {
        name: "Temp TextArea",
        type: "textarea",
        value: ""
    },
    Select: {
        name: "Temp Select",
        type: "select",
        options: [
            "",
            ""
        ],
        choice: 0
    }
}

interface ComponentOptions {
    data: Record<string, (TextAreaInput | SelectInput)>,
    ids: string[]
}

const tempData: ComponentOptions = {
    data: {},
    ids: []
}

const EditWidget = () => {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            if (router.isReady) {
                router.push("/");
            }
        },
    })
    const [codeState, setCodeState] = useState("");
    const [optionsState, setOptionsState] = useState(tempData);

    function handleChange(value: string, viewUpdate: ViewUpdate) {
        setCodeState(value);
    }

    async function saveChanges() {
        const updateCode = fetch('/api/post/createWidget/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: codeState })
        })
            .then((res) => {
                if (!res.ok) {
                    const error = new Error("Something Occured");
                    throw error;
                }
            })
        toast.promise(
            updateCode,
            {
                loading: 'Saving...',
                success: <b>Settings saved!</b>,
                error: <b>Could not save.</b>,
            }
        );
    }

    function optionChangeHandler(optionID, changeObj: { type: "textarea" | "select", isName?: boolean, index?: number }) {
        return (e) => {
            switch (changeObj.type) {
                case "select":
                    if (changeObj.index) {
                        setOptionsState(update(optionsState, {
                            data: {
                                [optionID]: {
                                    options: { $splice: [[changeObj.index, 1], [changeObj.index, 0, e.target.value]] }
                                }
                            }
                        }))
                    } else {
                        setOptionsState(update(optionsState, {
                            data: {
                                [optionID]: {
                                    name: { $set: e.target.value }
                                }
                            }
                        }))
                    }
                    break;
                case "textarea":
                    if (changeObj.isName) {
                        setOptionsState(update(optionsState, {
                            data: {
                                [optionID]: {
                                    name: { $set: e.target.value }
                                }
                            }
                        }))
                    } else {
                        setOptionsState(update(optionsState, {
                            data: {
                                [optionID]: {
                                    data: { $set: e.target.value }
                                }
                            }
                        }))
                    }
                    break;
                default:
                    break;
            }
        }
    }

    const addNewOption = (e) => {
        if (e.target.value !== "Choose to Add") {
            const newUUID = uuid();
            setOptionsState(update(optionsState, {
                data: { $merge: { [newUUID]: inputOptions[e.target.value] } },
                ids: { $push: [newUUID] }
            }))
        }
    }

    return (
        <Container>
            <Toaster toastOptions={{ position: "top-right" }} />
            <h1>Create Component</h1>
            <hr />
            <Row>
                <Col md={3}>
                    <h2>Options</h2>
                    <FloatingLabel controlId="floatingSelect" label="Add Option">
                        <Form.Select aria-label="add option form" value="0" onChange={addNewOption}>
                            {
                                ["Choose to Add", ...Object.keys(inputOptions)].map((option, indexY) => {
                                    return <option key={option + indexY} value={option}>{option}</option>
                                })
                            }
                        </Form.Select>
                    </FloatingLabel>
                    <hr />
                    {
                        optionsState.ids.map((optionID) => {
                            let optionData = optionsState.data[optionID];
                            switch (optionData.type) {
                                case "select":
                                    return (
                                        <div key={optionID}>
                                            <h3>Select</h3>
                                            <p>Name</p>
                                            <Form.Control
                                                aria-label="name"
                                                onChange={optionChangeHandler(optionID, { type: "select" })}
                                            />
                                            <br />
                                            <p>Choices</p>
                                            {
                                                optionData.options.map((optionName, index) => {
                                                    return <div key={optionName + index}>
                                                        <Form.Control
                                                            aria-label="choice"
                                                            value={optionName}
                                                            onChange={optionChangeHandler(optionID, { type: "select", index: index })}
                                                        />
                                                        <br />
                                                    </div>
                                                })
                                            }
                                            <hr />
                                        </div>
                                    );
                                case "textarea":
                                    return (
                                        <div key={optionID}>
                                            <h3>Textarea</h3>
                                            <p>Name</p>
                                            <Form.Control
                                                aria-label="name"
                                            />
                                            <br />
                                            <p>TextBox</p>
                                            <Form.Control
                                                aria-label="name"
                                            />
                                            <hr />
                                        </div>
                                    );
                            }
                        })
                    }
                </Col>
                <Col md={9}>
                    <h2>Code</h2>
                    <CodeMirror
                        value={codeState}
                        height="200px"
                        extensions={[StreamLanguage.define(go)]}
                        onChange={handleChange}
                    />
                    <hr />
                    <Button onClick={saveChanges}>Create Component</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default EditWidget;
