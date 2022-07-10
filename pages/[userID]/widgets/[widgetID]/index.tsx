import type { FC } from "react";
import { Button, Container } from "react-bootstrap";
import { PageItem } from '../../../../types/CatalogTypes';
import styles from '../../../../styles/CatalogItem.module.scss';
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import useSWR from "swr";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

const fetcher = async (url: string) => {
    const tempRes = await fetch(url);
    const res = await tempRes.json();
    if (!tempRes.ok) {
        const error = new Error(res.message);
        throw error;
    }
    return res;
};

interface catalogItemProps {
    pageItem: PageItem
}

const catalogItem: FC<catalogItemProps> = function catalogItem({ pageItem }) {
    const router = useRouter();
    const { data: savedData, error, mutate } = useSWR("/api/get/isItemSaved/" + pageItem._id, fetcher)

    const saveItemHandler = async () => {
        const temp = {
            id: pageItem._id
        };
        const tempFunc = async () => {
            const tempRes = await fetch('/api/post/saveItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(temp),
            });
            const res = await tempRes.json();
            return {isItemSaved: res.isItemSaved}
        };
        try {
            await mutate(tempFunc, {
                optimisticData: { isItemSaved: !savedData.isItemSaved },
                rollbackOnError: true,
                revalidate: false,
                populateCache: true
            })
        } catch (e) {
            toast.error("Failed to add the new item.");
        }

    }

    if (error) {
        router.push("/")
    }
    return (
        <Container>
            <Toaster toastOptions={{ position: "top-center" }} />
            <div className={styles.imageContainer} style={{ backgroundImage: 'URL(' + pageItem.imageURL + ')' }}>
            </div>
            <h1>{pageItem.name}</h1>
            {
                savedData ?
                    <Button onClick={saveItemHandler} variant={savedData.isItemSaved ? 'success' : 'primary'}>{savedData.isItemSaved ? "Saved" : "Save Item"}</Button>
                    : <Button onClick={saveItemHandler} variant='primary'>Save Item</Button>
            }
            <hr />
            <h2>Summary</h2>
            <p>{pageItem.summary}</p>
        </Container>
    )
}

export async function getStaticPaths() {
    const connection = await clientPromise;

    const shopBuilder = connection.db('shopBuilder');
    const catalogCollection = shopBuilder.collection('catalog');

    const tempIDs = catalogCollection.find({}).project({ _id: 1, creatorID: 1 });
    const userIDs = await tempIDs.toArray();

    const resObjs = userIDs.map((idObj: { _id: ObjectId, creatorID: ObjectId }) => {
        return ({
            params: {
                userID: idObj.creatorID.toString(),
                widgetID: idObj._id.toString()
            }
        })
    });

    return {
        paths: resObjs,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const connection = await clientPromise;
    const query = {
        _id: new ObjectId(params.widgetID)
    }

    const shopBuilderDB = connection.db('shopBuilder');
    const catalogCollection = shopBuilderDB.collection('catalog');

    const fullItem = await catalogCollection.findOne(query)

    return {
        props: {
            pageItem: { ...fullItem, _id: fullItem._id.toString(), creatorID: fullItem.creatorID.toString() }
        }
    }
}

export default catalogItem;
