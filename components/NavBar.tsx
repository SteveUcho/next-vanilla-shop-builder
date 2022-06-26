import { Navbar, Nav, Container, NavLink } from 'react-bootstrap'

function NavBar() {
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar