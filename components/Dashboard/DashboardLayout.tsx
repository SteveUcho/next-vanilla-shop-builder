import Link from "next/link";
import type { FC, ReactNode } from "react";
import { Col, Row, Container } from "react-bootstrap";

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout: FC<DashboardLayoutProps> = ({
    children
}) => {
    return (
        <Container>
            <h1>Dashboard</h1>
            <hr />
            <Row>
                <Col md={3}>
                    <div>
                        <Link href="/dashboard"><a>Dashboard</a></Link>
                    </div>
                    <h2>Manage</h2>
                    <div>
                        <Link href="/dashboard/catalog"><a>Catalog Items</a></Link>
                    </div>
                    <div>
                        <Link href="/dashboard/components"><a>Manage Components</a></Link>
                    </div>
                </Col>
                <Col md={9}>
                    { children }
                </Col>
            </Row>
        </Container>
    )
}

export default DashboardLayout;