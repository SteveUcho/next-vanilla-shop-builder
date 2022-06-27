import { Navbar, Nav, Container, NavLink } from 'react-bootstrap';
import { useSession, signIn, signOut } from "next-auth/react";

function NavBar() {
    const { data: session } = useSession();

    function checkSignedIn() {
        if (session) {
            return (
                <div>
                    {session.user.email + " "}
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            )
        }
        return (
            <div>
                Not signed in
                <button onClick={() => signIn()}>Sign in</button>
            </div>
        )
    }

    return (
        <Navbar sticky="top" bg="light" expand="lg">
            <Container>
                <NavLink className='navbar-brand'>
                    <h1>
                        <strong className='monokai-black'>Vanilla</strong>
                    </h1>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink href="/webbuilder">Web Builder</NavLink>
                        <NavLink href="/catalog">Catalog</NavLink>
                        <NavLink href="">FAQ</NavLink>
                        <NavLink href="">Contact</NavLink>
                    </Nav>
                    { checkSignedIn() }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar