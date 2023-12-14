import { useState } from 'react'
import { ListGroup, Card, Col, Row, Button, Navbar, Container, FormControl } from 'react-bootstrap';

function Header() {

    return (
        <>
            <Navbar bg='success' variant='dark' >
                <Container fluid >
                    <Button style={{ visibility: 'hidden', pointerEvents: 'none' }}></Button>
                    <Button variant="warning" className='justify-content-between'>Gluten-Hub</Button>
                    <Navbar.Brand className="bi bi-person-circle  justify-content-end" style={{fontSize: "2rem", marginRight: 0}}/>
                </Container>
            </Navbar >
            <Row className="align-items-center" style={{marginRight: 0, marginTop:"2%", marginLeft:"2%"}}>
                <Col xs={1} className="d-flex align-items-center" style={{marginRight:"2%"}}>
                    <i className="bi bi-search" style={{fontSize: "1.5rem"}}></i>
                </Col>
                <Col xs={9}>
                    <FormControl type="search" placeholder="Search" />
                </Col>
                <Col xs={1} className="d-flex justify-content-end align-items-center" style={{marginLeft:"2%"}}>
                    <i className="bi bi-sliders" style={{fontSize: "1.5rem"}}></i>
                </Col>
            </Row>
        </>
    );
}

function RestaurantsList() {
    const [list, setList] = useState([
        { key: '1', name: 'alecosta', stars: '4', prices: '4', image_path: 'image2.jpg' },
        { key: '2', name: 'davide', stars: '3', prices: '3', image_path: 'image1.jpg' },
        { key: '3', name: 'grammar man', stars: '5', prices: '5', image_path: 'image3.jpg' },
        { key: '4', name: 'new person 1', stars: '2', prices: '2', image_path: 'image4.jpg' },
        { key: '5', name: 'new person 2', stars: '4', prices: '3', image_path: 'image5.jpg' },
        { key: '6', name: 'new person 3', stars: '3', prices: '4', image_path: 'image6.jpg' },
        { key: '7', name: 'john doe', stars: '4', prices: '5', image_path: 'image7.jpg' },
        { key: '8', name: 'mary smith', stars: '5', prices: '4', image_path: 'image8.jpg' },
        { key: '9', name: 'jane doe', stars: '3', prices: '2', image_path: 'image9.jpg' },
        { key: '10', name: 'alex brown', stars: '4', prices: '3', image_path: 'image10.jpg' },
    ]);

    return (
        <ListGroup>
            {list.map((item) => {
                return (
                    <Card key={item.id} onClick={() => { console.log('ciauuuu') }}>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {
                                            Array.from({ length: item.stars }, (_, index) => (
                                                <i key={index} className="bi bi-star-fill"></i>
                                            ))
                                        }
                                    </Card.Text>
                                    <Card.Text>
                                        {
                                            Array.from({ length: item.prices }, (_, index) => (
                                                <i key={index} className="bi bi-currency-euro"></i>
                                            ))
                                        }
                                    </Card.Text>
                                </Col>
                                <Col>
                                    <img height={"100px"} width={"100px"} src='./src/download.png' />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                );
            })}
        </ListGroup>
    );
}


function Home() {
    return (
        <>
            <Header/>
            <RestaurantsList/>
        </>
    );
}
export { Home };
