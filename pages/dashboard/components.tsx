import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import useSWR from "swr";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";

const fetcher = async (url: string) => {
    const tempRes = await fetch(url);
    const res = await tempRes.json();
    if (!tempRes.ok) {
        const error = new Error(res.message);
        throw error;
    }
    return res;
};

const manageComponents = () => {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            if (router.isReady) {
                router.push("/");
            }
        },
    })
    const { data: savedData, error, mutate } = useSWR("/api/get/dashboard/getCatalogItems", fetcher)

    if (status === "loading") {
        return <div>Loading...</div>
    }

    return (
        <DashboardLayout>
            <div>
                <h2>Components</h2>
                <Link href="/dashboard/create/component">
                    <a className="btn btn-primary">Create New Component</a>
                </Link>
                <hr />
                {savedData ?
                    savedData.components.map((component) => {
                        return (
                            <div key={component._id}>
                                {component.name + " "}
                                <Link href={"/dashboard/editComponent/" + component._id}>
                                    <a className="btn btn-primary">Edit</a>
                                </Link>
                            </div>
                        )
                    })
                    : null
                }
            </div>
        </DashboardLayout>
    )
}

export default manageComponents;