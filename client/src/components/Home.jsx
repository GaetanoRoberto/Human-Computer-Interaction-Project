import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {ListGroup, Card, Col, Row, Button, Navbar, Container, FormControl, Badge} from 'react-bootstrap';
import { ReactSmartScroller } from 'react-smart-scroller';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Header() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar bg='success' variant='dark' >
                <Container fluid >
                    <Button style={{ visibility: 'hidden', pointerEvents: 'none' }}></Button>
                    <Button variant="warning" className='justify-content-between' onClick={() => navigate('/')}>Gluten-Hub</Button>
                    <Navbar.Brand className="bi bi-person-circle  justify-content-end" style={{fontSize: "2rem", marginRight: 0}} onClick={() => navigate('/settings')}/>
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
                    <i className="bi bi-sliders" style={{fontSize: "1.5rem"}} onClick={() => navigate('/filters')}></i>
                </Col>
            </Row>
        </>
    );
}

function Filters(props) {
    const {filters} = props;
    console.log(filters);
    return(
        <ReactSmartScroller spacing={10}>
            {
                filters.map((filter, index) => (
                    <h2>
                        <Button active style={{borderRadius: "20px", marginTop: "0.5rem", backgroundColor: "#0D6EFD"}}>
                            <span> {filter} </span>
                            <span style={{marginLeft: "5px"}} onClick={() => setFilters(filters.filter(f => f !== filter))}><FontAwesomeIcon icon="fa-regular fa-circle-xmark" size="lg" /></span>
                        </Button>
                    </h2>
                ))
            }
        </ReactSmartScroller>
    );

}

function RestaurantsList(props) {
    const navigate = useNavigate();
    const {restaurants} = props;
    
    return (
        <ListGroup>
            {restaurants.map((restaurant) => {
                return (
                    <Card key={restaurant.id} onClick={() => { navigate(`/restaurants/${restaurant.id}/menu/`) }}>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Title>{restaurant.name}</Card.Title>
                                    <Card.Text>
                                        {
                                            Array.from({ length: restaurant.avg_stars }, (_, index) => (
                                                <i key={index} className="bi bi-star-fill"></i>
                                            ))
                                        }
                                    </Card.Text>
                                    <Card.Text>
                                        {
                                            Array.from({ length: restaurant.avg_price }, (_, index) => (
                                                <i key={index} className="bi bi-currency-euro"></i>
                                            ))
                                        }
                                    </Card.Text>
                                </Col>
                                <Col>
                                    <img height={"100px"} width={"100px"} src={restaurant.image} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                );
            })}
        </ListGroup>
    );
}


function Home(props) {
    return (
        <>
            <Header/>
            <Filters filters={props.filters}/>
            <RestaurantsList restaurants={props.restaurants}/>
        </>
    );
}
export { Home };
