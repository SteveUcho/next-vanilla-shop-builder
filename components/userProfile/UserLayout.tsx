import Image from "next/image";
import type { FC, ReactNode } from "react";
import { Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { User } from "../../types/UserTypes";

interface UserLayoutProps {
    user: User
    children: ReactNode
}

const UserLayout: FC<UserLayoutProps> = function UserLayout({
    user,
    children
}) {
    return (
        <Container>
            <Row>
                <Col md={3}>
                    <Image
                        src={user.image}
                        width="100"
                        height="100"
                    />
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                </Col>
                <Col md={9}>
                    { children }
                </Col>
            </Row>
        </Container>
    )
}

export default UserLayout;