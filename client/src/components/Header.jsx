import { Button, Navbar, Container, Row, FormControl, Col } from 'react-bootstrap';

import 'bootstrap-icons/font/bootstrap-icons.css';



function Header() {

    return (
        <>
            <Navbar bg='success' variant='dark' >
                <Container fluid >
                    <Button style={{ visibility: 'hidden', pointerEvents: 'none' }}></Button>
                    <Button variant="warning"  className='justify-content-between'>Gluten-Hub</Button>
                    <Navbar.Brand className="bi bi-person-circle   justify-content-end" />

                </Container>
            </Navbar >
            <Row className="align-items-center" style={{ marginTop: '10px' }}>
      <Col xs={1} className="d-flex align-items-center">
        <i className="bi bi-search"></i>
        </Col>
        <Col xs={9}>
        <FormControl type="search"  placeholder="Search" />
      </Col>
      <Col  xs={1} className="d-flex justify-content-end align-items-center">
        <i className="bi bi-sliders"></i>
      </Col>
    </Row>
        </>
    );
}



export { Header };
