import { Navbar, Nav, Container, NavLink, Button } from 'react-bootstrap';
import { useSession, signIn, signOut } from "next-auth/react";

function NavBar() {
    const { data: session } = useSession();

    function siginStatus() {
        if (session) {
            return (
                <div>
                    UserID: <a href={"/" + session.user.id}>{session.user.id}</a> {" "}
                    <Button onClick={() => signOut()} variant="danger">Sign Out</Button>
                </div>
            )
        }
        return (
            <div>
                {"Not signed in "}
                <Button onClick={() => signIn()}>Sign In</Button>
            </div>
        )
    }

    return (
        <Navbar sticky="top" bg="light" expand="lg">
            <Container>
                <NavLink className='navbar-brand' href="/">
                    <h1>
                        <strong className='monokai-black'>Vanilla</strong>
                    </h1>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {session ?
                            <>
                                <NavLink href="/webbuilder">Web Builder</NavLink>
                                <NavLink href="/catalog">Catalog</NavLink>
                            </>
                            : null
                        }
                        <NavLink href="">FAQ</NavLink>
                        <NavLink href="">Contact</NavLink>
                    </Nav>
                    {siginStatus()}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar