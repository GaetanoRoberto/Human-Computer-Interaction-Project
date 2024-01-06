import { useState, useEffect } from 'react'
import API from '../API';
import { useNavigate } from 'react-router-dom'
import { ListGroup, Card, Col, Row, Button, Navbar, Container, Form, Badge, Fade } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Header } from './Header';


function getHappinessClass(index) {
    switch (index) {
      case 0:
        return "fa-regular fa-face-dizzy";
      case 1:
        return "fa-regular fa-face-tired";
      case 2:
        return "fa-regular fa-face-meh";
      case 3:
        return "fa-regular fa-face-smile";
      case 4:
        return "fa-regular fa-face-grin-stars";
      default:
        return " ";
    }
  }
  function getHappinessSolidClass(index) {
    switch (index) {
      case 0:
        return "fa-solid fa-face-dizzy";
      case 1:
        return "fa-solid fa-face-tired";
      case 2:
        return "fa-solid fa-face-meh";
      case 3:
        return "fa-solid fa-face-smile";
      case 4:
        return "fa-solid fa-face-grin-stars";
      default:
        return " ";
    }
  }
  function getHappinessColor(index) {
    switch (index) {
      case 0:
        return "#ff3300" // Faccina arrabbiata
      case 1:
        return "#ff8300"; // Faccina triste
      case 2:
        return "#FFD700"; // Faccina neutra
      case 3:
        return "#00ff5b"; // Faccina sorridente
      case 4:
        return "green"; // Faccina che ride
      default:
        return " ";
    }
  }
  
function SearchBar(props) {
    const { search, setSearch, setRestaurantList, restaurantInitialList} = props;
    const navigate = useNavigate();

    const handleSearch = (ev) => {
        setSearch(ev.target.value);
        setRestaurantList(restaurantInitialList.filter((restaurant) =>
            (restaurant.name.toLowerCase().includes(ev.target.value.trim().toLowerCase()))
        ));
    }


    return (
        <>
            <div style={{ borderTop: "1px solid #000", margin: 0 }}></div>
            <Row className="align-items-center" style={{ marginRight: 0, marginTop: "0.2rem", marginLeft: 0, marginBottom: "0.2rem" }}>
                <Col xs={1} className="d-flex align-items-center" style={{ marginRight: "2%" }}>
                    <i className="bi bi-search" style={{ fontSize: "1.5rem" }}></i>
                </Col>
                <Col>
                    <Form.Control type="search" placeholder="Search" value={search} onChange={handleSearch} />
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
    const { filterRestaurants, filters, search } = props;
    // Used for scrollable restaurant list
    const listHeight = ( filters.length === 0 ? (window.innerHeight - 104) : (window.innerHeight - 150));


    return (
        <ListGroup className="scroll" style={{overflowY: "auto", maxHeight: listHeight}}>
            {
             filterRestaurants().length === 0 ?
                <>
                    <div style={{borderTop: "1px solid", margin: 0, color: "lightgray"}}></div>
                    <p style={{marginTop: "1rem", textAlign: "center"}}> No result for "<b>{search.trim()}</b>" with the selected filters! </p>
                </>
                :
                filterRestaurants().map((restaurant) => {
                return (
                    <Card key={restaurant.id} style={{borderRadius: 0, borderBottom: 0}} onClick={() => { navigate(`/restaurants/${restaurant.id}/menu`) }}>
                        <Button variant="light">
                            <Row>
                                <Col>
                                    <Card.Title style={{textAlign: "start"}}>{restaurant.name}</Card.Title>
                                    <Card.Text style={{textAlign: "start"}}>
                                        {
                                            Array.from({ length: Math.round(restaurant.avg_quality) }, (_, index) => (
                                                <i key={index} className="bi bi-star-fill " style={{ color: '#FFD700', marginRight:"5px" ,fontSize:"1.2em"}}></i>
                                            ))
                                        }
                                    </Card.Text>
                                    <Card.Text style={{textAlign: "start"}}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                            <FontAwesomeIcon hidden = {Math.round(restaurant.avg_safety) == 0}// hidden if no reviews [TANUCC]
                                                key={index}
                                                icon={(index + 1 !=  Math.round(restaurant.avg_safety)) ? getHappinessClass(index) : getHappinessSolidClass(index)}
                                                style={{color: (index < 5) ? getHappinessColor(index) : "", marginRight:"5px",fontSize:"1.2em"}} />))}
                                    </Card.Text>
                                    <Card.Text style={{textAlign: "start"}}>
                                        {
                                            Array.from({ length: Math.round(restaurant.avg_price) }, (_, index) => (
                                                <i key={index} className="bi bi-currency-euro" style={{  marginRight:"5px" ,fontSize:"1.2em"}}></i>
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
    const [restaurantList, setRestaurantList] = useState([]);
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    const [restaurantInitialList, setRestaurantInitialList] = useState([]);
    // Create an array of boolean states for the fade animation
    const [fadeStates, setFadeStates] = useState([]);

    useEffect(() => {
        async function getRestaurants() {
            try {
                const restaurants = await API.getRestaurants();
                setRestaurantList(restaurants);
                setRestaurantInitialList(restaurants);
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
            <SearchBar search={search} setSearch={setSearch} setRestaurantList={setRestaurantList} restaurantInitialList={restaurantInitialList} />
            <Filters filters={filters} setFilters={setFilters} fadeStates={fadeStates} setFadeStates={setFadeStates} />
            <RestaurantsList filterRestaurants={filterRestaurants} filters={filters} search={search} />
        </>
    );
}
export { Home, Header,SearchBar };
