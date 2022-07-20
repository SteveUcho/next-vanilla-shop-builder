import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";

const manageCatalog = () => {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            if (router.isReady) {
                router.push("/");
            }
        },
    })

    if (status === "loading") {
        return <div>Loading...</div>
    }

    return (
        <DashboardLayout>
            <h1>Hello, {session.user.name}</h1>
            <h1>Hi this is Manage Catalog</h1>
        </DashboardLayout>
    )
}

export default manageCatalog;