import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Container } from 'react-bootstrap';
import { Widget } from '../../../../types/ComponentEditorTypes';
import useSWR from 'swr';
import toast, { Toaster } from "react-hot-toast";
import { ViewUpdate } from '@codemirror/view';

const fetcher = async (url: string) => {
    const tempRes = await fetch(url);
    const res = await tempRes.json();
    if (!tempRes.ok) {
        const error = new Error(res.message);
        throw error;
      }
    return res;
};

const EditWidget = function EditWidget() {
    const router = useRouter();
    const { userID, widgetID } = router.query;
    const { data: widgetData, error } = useSWR<Widget>(router.isReady ? '/api/get/editWidget/' + widgetID : null, fetcher);
    const [codeState, setCodeState] = useState("");

    useEffect(() => {
        if (!error && widgetData) {
            setCodeState(widgetData.code);
        }
    }, [widgetData])

    function handleChange(value: string, viewUpdate: ViewUpdate) {
        setCodeState(value);
    }

    async function saveChanges() {
        const updateCode = fetch('/api/post/editWidget/' + widgetID, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: codeState })
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

    if (error) {
        router.push("/" + userID + "/widgets/" + widgetID);
    }
    if (!widgetData) {
        return (
            <div>"Loading..."</div>
        );
    }
    return (
        <Container>
            <Toaster toastOptions={{ position: "top-right" }} />
            <h1>UserID:{userID}</h1>
            <h1>WidgetID:{widgetID}</h1>
            <hr />
            <CodeMirror
                value={codeState}
                height="200px"
                extensions={[StreamLanguage.define(go)]}
                onChange={handleChange}
            />
            <hr />
            <Button onClick={saveChanges}>Save Changes</Button>
        </Container>
    );
}

export default EditWidget;
