import { Navbar, Nav, Container, NavLink, Button } from 'react-bootstrap';
import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';

function NavBar() {
    const { data: session } = useSession();

    function siginStatus() {
        if (session) {
            return (
                <div>
                    UserID: <Link href={"/dashboard"}><a>{session.user.id}</a></Link>{" "}
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
                <Link href="/">
                    <a className='nav-link navbar-brand'>
                        <h1>
                            <strong className='monokai-black'>Vanilla</strong>
                        </h1>
                    </a>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {session ?
                            <>
                                <Link href="/webbuilder"><a className='nav-link'>Web Builder</a></Link>
                                <Link href="/catalog"><a className='nav-link'>Catalog</a></Link>
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