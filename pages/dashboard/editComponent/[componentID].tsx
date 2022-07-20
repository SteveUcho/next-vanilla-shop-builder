import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Container } from 'react-bootstrap';
import { Widget } from '../../../types/ComponentEditorTypes';
import useSWR from 'swr';
import toast, { Toaster } from "react-hot-toast";
import { ViewUpdate } from '@codemirror/view';
import { useSession } from 'next-auth/react';

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
    const { componentID } = router.query;
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            if (router.isReady) {
                router.push("/");
            }
        },
    })
    const { data: widgetData, error } = useSWR<Widget>(router.isReady ? '/api/get/editWidget/' + componentID : null, fetcher);
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
        const updateCode = fetch('/api/post/editWidget/' + componentID, {
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

    if (error) {
        router.push("/");
    }
    if (!widgetData) {
        return (
            <div>"Loading..."</div>
        );
    }
    return (
        <Container>
            <Toaster toastOptions={{ position: "top-right" }} />
            <h1>UserID:{session.user.id}</h1>
            <h1>WidgetID:{componentID}</h1>
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
