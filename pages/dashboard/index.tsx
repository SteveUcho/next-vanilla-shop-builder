import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";

const Dashboard = () => {
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
            <h1>Hi this is the Base Dasboard</h1>
        </DashboardLayout>
    )
}

export default Dashboard;