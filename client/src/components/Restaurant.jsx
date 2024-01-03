import {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {
    ListGroup,
    Card,
    Col,
    Row,
    Button,
    Container,
    Form,
    Modal, Badge
} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import instagramImage from "../restaurantPng/instagram.png";
import facebookImage from "../restaurantPng/facebook.png";
import phoneImage from "../restaurantPng/phone.png";
import webImage from "../restaurantPng/domain-registration.png";
import API from "../API.jsx";
import {NavigationButtons} from "./NavigationButtons.jsx";
import {Header} from "./Header.jsx";
import {Reviews} from "./ReviewsList.jsx";
import {address_string_to_object} from "./RestaurantFormUtility.jsx";



const Banner = (props) => {
    const { restaurant } = props;

    // Used to show the restaurant rating based on the reviews
    const restaurantStars = () => {
        const averageQuality = (restaurant.reviews.reduce( (sum, review) => sum + review.quality, 0)) / restaurant.reviews.length;
        const averageSafety = (restaurant.reviews.reduce( (sum, review) => sum + review.safety, 0)) / restaurant.reviews.length;
        // return Array.from({ length: Math.round(averageStars) }, (_, index) => ( <i key={index} className="bi bi-star-fill"></i> ));
        return (
            <h6>
                Quality: <i className="bi bi-star-fill"></i> {averageQuality.toFixed(1)}
                {" "}
                Safety: <i className="bi bi-star-fill"></i> {averageSafety.toFixed(1)}
            </h6>
        );
    }

    // Functions used to show the opening hours status based on real time
    const getOpeningHours = (openingHours) => {
        const currentDateTime = new Date();
        const currentHour = currentDateTime.getHours();
        const currentMinutes = currentDateTime.getMinutes();
        const currentTime = currentHour * 60 + currentMinutes;

        const timeRanges = openingHours.split(';').map(range => {
            const [start, end] = range.split('-').map(time => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            });
            return { start, end };
        });

        for (const { start, end } of timeRanges) {
            if ( (currentTime >= start && currentTime <= end) || (end >= 0 && end <= 420 && currentTime >= start && currentTime >= end) ) {
                return `Open now (closes at ${formatTime(end)})`;
            }
        }

        const nextOpeningTime = timeRanges.reduce((closestTime, { start }) => {
            return start > currentTime && (start < closestTime || closestTime === -1) ? start : closestTime;
        }, -1);

        if (nextOpeningTime !== -1) {
            return `Closed now (opens at ${formatTime(nextOpeningTime)})`;
        } else {
            return `Closed now (opens tomorrow at ${openingHours.split('-')[0]})`;
        }
    }
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${padZero(hours)}:${padZero(mins)}`;
    }
    const padZero = (number) => {
        return number < 10 ? `0${number}` : number;
    }

    // Used for banner image zoom
    const bannerZoom = () => {
        const img = new Image();
        img.src = restaurant.image;
        if (window.innerWidth > img.width)
            return window.innerWidth / img.width;
        else
            return 1;
    }


    return(
        <>
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>
            <Container fluid style={{ position: 'relative', overflow: 'hidden', height: "148px" }}>
                {/* Background Image Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${restaurant.image})`,
                        backgroundPositionY: 'center',
                        opacity: 0.2,
                        zoom: bannerZoom(),
                        zIndex: -1, // Ensure the overlay is behind the text
                    }} >
                </div>
                {/* Content with Text */}
                <Row>
                    <h1> <b><i> {restaurant.name} </i></b> </h1>
                </Row>
                <Row>
                    <Col xs={5} style={{marginTop: "0.4rem"}}> {restaurantStars()} </Col>
                    <Col style={{textAlign: "end"}}>
                        <Link to={`tel:${restaurant.phone}`}><img width="40px" height="40px" src={phoneImage}/></Link>
                        <Link style={{marginLeft: "0.5rem"}} to={restaurant.website}><img width="40px" height="40px" src={webImage}/></Link>
                        <Link style={{marginLeft: "0.5rem"}} to={restaurant.facebook}><img width="40px" height="40px" src={facebookImage}/></Link>
                        <Link style={{marginLeft: "0.5rem"}} to={restaurant.instagram}><img width="40px" height="40px" src={instagramImage}/></Link>
                    </Col>
                </Row>
                <Row>
                    <h6><FontAwesomeIcon icon="fa-solid fa-location-dot" /> {address_string_to_object(restaurant.location).text} </h6>
                </Row>
                <Row>
                    <h6><FontAwesomeIcon icon="fa-solid fa-clock" /> {getOpeningHours(restaurant.hours)} </h6>
                </Row>
            </Container>
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>
        </>
    );
}

const Menu = (props) => {
    const { restaurant } = props;

    const allDishTypes = [...new Set(restaurant.dishes.map(dish => dish.type))];
    const [type, setType] = useState(allDishTypes[0]);
    const [search, setSearch] = useState("");
    const [filteredDishes, setFilteredDishes] = useState(restaurant.dishes);
    const [ingredient, setIngredient] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const menuHeight = (window.innerHeight - 336);


    const handleSearch = (ev) => {
        setSearch(ev.target.value);
        setFilteredDishes(restaurant.dishes.filter((dish) =>
            (dish.name.toLowerCase().includes(ev.target.value.toLowerCase()))
            ||
            (dish.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(ev.target.value.toLowerCase())))
        ));
    }

    const fetchIngredient = async (id) => {
        try {
            const ingredient = await API.getIngredient(id);
            setIngredient(ingredient);
        } catch (error) {
            console.log(error);
        }
    }

    function IngredientModal(props) {
        let allergens = [];

        if(!ingredient)
            return null;

        if(ingredient.allergens !== null)
            allergens = ingredient.allergens.split(',').map(allergen => allergen.trim());


        return(
            <Modal {...props} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title> <i> {ingredient.name} </i> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            { allergens.length === 0 ?
                                <h5 style={{marginTop: "0.4rem"}}> No allergens </h5>
                                :
                                allergens.map((allergen) => (
                                    <h5 style={{marginTop: "0.4rem"}}>
                                        <Badge style={{borderRadius: 20}} bg={ allergen === "lactose" ? "info" : allergen === "pork" ? "secondary" : allergen === "gluten" ? "danger" : "primary"}>
                                            { allergen === "gluten" ?
                                                <>
                                                    <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" /> {allergen}
                                                </>
                                                :
                                                allergen
                                            }
                                        </Badge>
                                    </h5>
                                ))
                            }
                            { ingredient.brandLink === null ?
                                <h5 style={{marginTop: "3rem"}}>
                                    {ingredient.brandName}
                                </h5>
                                :
                                <>
                                    <h6 style={{marginTop: "3rem"}}>
                                        Brand :
                                    </h6>
                                    <Button variant="link" size="lg" className="custom-link-button" href={ingredient.brandLink}> {ingredient.brandName} </Button>
                                </>
                            }
                        </Col>
                        <Col style={{textAlign: "end"}}>
                            <img height={"130px"} width={"130px"} src={ingredient.image} />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }


    return(
        <>
            {/*Search bar component*/}
            <Row className="align-items-center" style={{marginRight: 0, marginTop:"0.2rem", marginLeft: 0, marginBottom: "0.2rem", height: "37px"}}>
                <Col xs={1} className="d-flex align-items-center" style={{marginRight:"2%"}}>
                    <i className="bi bi-search" style={{fontSize: "1.5rem"}}></i>
                </Col>
                <Col>
                    <Form.Control type="search" placeholder="Search" value={search} onChange={handleSearch}/>
                </Col>
            </Row>

            {/*Menu categories*/}
            <Col className="scroll" style={{ display: "flex", overflowX: "scroll"}}>
                {allDishTypes.map((currentType, index) => (
                    <Button key={index} active={currentType === type} onClick={() => setType(currentType)} variant="light" size="lg" style={{borderRadius: 0, borderColor: "#1a1a1a"}}>
                        {currentType}
                    </Button>
                ))}
            </Col>
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>

            {/*Menu dishes*/}
            <ListGroup className="scroll" style={{overflowY: "scroll", maxHeight: menuHeight}}>
                { filteredDishes.filter((dish) => dish.type === type).length === 0 ?
                    <p style={{marginTop: "1rem", marginLeft: "0.4rem"}}> No result for "<b>{search}</b>" in this menu section! </p>
                    :
                    filteredDishes.filter((dish) => dish.type === type).map((dish) => {
                    return (
                        <Card key={dish.id} style={{borderRadius: 0, borderTop: 0}}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title> {dish.name} </Card.Title>
                                        <Card.Text>
                                            {
                                                dish.ingredients.map((ingredient, index) => (
                                                    <>
                                                        <Button variant="link" className="custom-link-button" onClick={() => {fetchIngredient(ingredient.id); setModalShow(true)}}> {ingredient.name} </Button>
                                                        {index < dish.ingredients.length - 1 && ', '}
                                                    </>
                                                ))
                                            }
                                        </Card.Text>
                                        <Card.Text>
                                            <i> {dish.price}<i className="bi bi-currency-euro"></i> </i>
                                        </Card.Text>
                                    </Col>
                                    <Col xs={4} style={{textAlign: "end"}}>
                                        <img height={"100px"} width={"100px"} src={dish.image} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    );
                })}
            </ListGroup>

            {/*Ingredient modal*/}
            <IngredientModal show={modalShow} onHide={() => setModalShow(false)} />
        </>
    );
}

const Details = (props) => {
    const { restaurant } = props;

    const descriptionHeight = (window.innerHeight - 450);

    function formatTimeRanges(input) {
        const timeRanges = input.split(';').map(range => range.trim());

        const formattedRanges = timeRanges.map((range, index) => {
            const [startTime, endTime] = range.split('-');
            const from = index === 0 ? 'From' : 'from';

            return `${from} ${startTime} to ${endTime}`;
        });

        return formattedRanges.join(', ');
    }


    return(
        <>
        {/*Description*/}
        <Card style={{borderRadius: 0}}>
            <Card.Header as="h2" style={{textAlign: "center"}}>
                Description
            </Card.Header>
            <Card.Body style={{overflowY: "auto", maxHeight: descriptionHeight}}>
                <Card.Text>
                    {restaurant.description}
                </Card.Text>
            </Card.Body>

            {/*Opening Hours*/}
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>
            <Card.Header as="h2" style={{textAlign: "center"}}>
                Opening Hours
            </Card.Header>
            <Card.Body>
                <Card.Title as="h4" style={{maxWidth: 200}}>
                    {formatTimeRanges(restaurant.hours)}
                </Card.Title>
            </Card.Body>
        </Card>
        </>
    );
}


function Restaurant() {
    const { id } = useParams();
    const location = useLocation();
    const regexDetails = /\/details$/;
    const regexMenu = /\/menu$/;
    const regexReviews = /\/reviews$/;
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState(regexMenu.test(location.pathname));
    const [details, setDetails] = useState(regexDetails.test(location.pathname));
    const [reviews, setReviews] = useState(regexReviews.test(location.pathname));

    useEffect(() => {
        const getRestaurant = async () => {
            try {
                const restaurant = await API.getRestaurant(id);
                //console.log(restaurant);
                setRestaurant(restaurant);
            } catch (error) {
                console.log(error);
            }
        }

        getRestaurant();
    }, [id]);


    return (
        <>
            { restaurant && (
                <>
                    <Header/>
                    <Banner restaurant={restaurant} />
                    { menu ? (
                        <Menu restaurant={restaurant} />
                    ) : details ? (
                        <Details restaurant={restaurant} />
                    ) : (
                        <Reviews reviews={restaurant.reviews}/>
                    )}
                    <NavigationButtons
                        id={id}
                        menu={menu}
                        setMenu={setMenu}
                        details={details}
                        setDetails={setDetails}
                        reviews={reviews}
                        setReviews={setReviews}
                    />
                </>
            )}
        </>
    );
}
export { Restaurant };
