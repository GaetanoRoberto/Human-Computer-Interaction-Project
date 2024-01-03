import { useState, useEffect } from 'react'
import API from '../API';
import { useNavigate } from 'react-router-dom'
import { ListGroup, Card, Col, Row, Button, Navbar, Container, FormControl, Badge, Fade } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Header } from './Header';

function SearchBar() {
    const navigate = useNavigate();

    return (
        <>
            <div style={{ borderTop: "1px solid #000", margin: 0 }}></div>
            <Row className="align-items-center" style={{ marginRight: 0, marginTop: "0.2rem", marginLeft: 0, marginBottom: "0.2rem" }}>
                <Col xs={1} className="d-flex align-items-center" style={{ marginRight: "2%" }}>
                    <i className="bi bi-search" style={{ fontSize: "1.5rem" }}></i>
                </Col>
                <Col>
                    <FormControl type="search" placeholder="Search" />
                </Col>
                <Col xs={1} className="d-flex justify-content-end align-items-center" style={{ marginLeft: "3%" }}>
                    <i className="bi bi-sliders" style={{ fontSize: "1.5rem" }} onClick={() => navigate('/filters')}></i>
                </Col>
            </Row>
        </>
    )
}


function Filters(props) {
    const { filters, setFilters, fadeStates, setFadeStates } = props;
    // const [list, setList] = useState(initialList);

    const handleFadeClick = (filter, index) => {
        setFadeStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = false;
            return newStates;
        });

        setTimeout(() => {
            setFilters(filters.filter(f => f !== filter));
            setFadeStates(prevStates => {
                const newStates = [...prevStates];
                newStates[index] = true;
                return newStates;
            });
        }, 300);
    };


    return (
        <Container fluid className="scroll" style={{ marginTop: "0.4rem", display: "flex", overflowX: "auto" }}>
            {filters.map((filter, index) => (
                <h2 key={index}>
                    <Fade in={fadeStates[index]}>
                        <Button active style={{ marginRight: "0.4rem", borderRadius: "10px", backgroundColor: "#52b69a", borderColor: "#52b69a", whiteSpace: "nowrap" }}>
                            {filter}
                            <span style={{ marginLeft: "0.7rem", display: "inline-block" }} onClick={() => handleFadeClick(filter, index)}>
                                <FontAwesomeIcon icon="fa-solid fa-xmark" />
                            </span>
                        </Button>
                    </Fade>
                </h2>
            ))}
        </Container>
    );
}

function RestaurantsList(props) {
    const navigate = useNavigate();
    const { filterRestaurants, filters } = props;
    // Used for scrollable restaurant list
    const listHeight = ( filters.length === 0 ? (window.innerHeight - 104) : (window.innerHeight - 150));


    return (
        <ListGroup className="scroll" style={{overflowY: "auto", maxHeight: listHeight}}>
            {filterRestaurants().map((restaurant) => {
                return (
                    <Card key={restaurant.id} style={{borderRadius: 0, borderBottom: 0}} onClick={() => { navigate(`/restaurants/${restaurant.id}/menu`) }}>
                        <Button variant="light">
                            <Row>
                                <Col>
                                    <Card.Title style={{textAlign: "start"}}>{restaurant.name}</Card.Title>
                                    <Card.Text style={{textAlign: "start"}}>
                                        {
                                            Array.from({ length: restaurant.avg_quality }, (_, index) => (
                                                <i key={index} className="bi bi-star-fill"></i>
                                            ))
                                        }
                                    </Card.Text>
                                    <Card.Text style={{textAlign: "start"}}>
                                        {
                                            Array.from({ length: restaurant.avg_safety }, (_, index) => (
                                                <i key={index} className="bi bi-star-fill"></i>
                                            ))
                                        }
                                    </Card.Text>
                                    <Card.Text style={{textAlign: "start"}}>
                                        {
                                            Array.from({ length: restaurant.avg_price }, (_, index) => (
                                                <i key={index} className="bi bi-currency-euro"></i>
                                            ))
                                        }
                                    </Card.Text>
                                </Col>
                                <Col style={{textAlign: "end"}}>
                                    <img height={"100px"} width={"100px"} src={restaurant.image} />
                                </Col>
                            </Row>
                        </Button>
                    </Card>
                );
            })}
        </ListGroup>
    );
}


function Home(props) {
    const [restaurantList, setrestaurantList] = useState([]);
    const [filters, setFilters] = useState([]);
    // Create an array of boolean states for the fade animation
    const [fadeStates, setFadeStates] = useState([]);

    useEffect(() => {
        async function getRestaurants() {
            try {
                const restaurants = await API.getRestaurants();
                setrestaurantList(restaurants);
            } catch (error) {
                console.log(error);
            }
        };
        async function getFilters() {
            try {
                const filters = await API.getFilters();
                setFilters(filters);
                setFadeStates(filters.map(() => true));
            } catch (error) {
                console.log(error);
            }
        };

        getRestaurants();
        getFilters();
    }, []);

    /*
    * Function to filter the restaurants based on the selected filters for the home page
    */
    function filterRestaurants() {
        return restaurantList.filter((restaurant) => {
            // if no filter applied, return all the restaurants
            if (filters.length === 0) {
                return true;
            }
            // otherwise, return only the restaurants that have at least one matching type
            for (const dish_type of restaurant.dish_types) {
                for (const filter_dish_type of filters) {
                    if (filter_dish_type === dish_type) {
                        return true;
                    }
                }
            }
            return false;
        });
    }

    return (
        <>
            <Header />
            <SearchBar/>
            <Filters filters={filters} setFilters={setFilters} fadeStates={fadeStates} setFadeStates={setFadeStates} />
            <RestaurantsList filterRestaurants={filterRestaurants} filters={filters} />
        </>
    );
}
export { Home, Header,SearchBar };
