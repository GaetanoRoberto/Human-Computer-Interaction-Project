import {useContext, useEffect, useState} from 'react'
import {Link, useLocation, useParams, useNavigate} from 'react-router-dom'

import {
    ListGroup,
    Card,
    Col,
    Row,
    Button,
    Container,
    Form,
    Modal, Badge, Stack
} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import instagramImage from "../restaurantPng/instagram.png";
import facebookImage from "../restaurantPng/facebook.png";
import phoneImage from "../restaurantPng/phone.png";
import webImage from "../restaurantPng/domain-registration.png";
import twitterImage from "../restaurantPng/twitter.png";
import API from "../API.jsx";
import {NavigationButtons} from "./NavigationButtons.jsx";
import {Reviews} from "./ReviewsList.jsx";
import {address_string_to_object, time_string_to_object} from "./RestaurantFormUtility.jsx";
import {ErrorContext} from "./userContext.jsx";
import {DishIngredientsView} from "./DishIngredientsView.jsx";


function getHappinessSolidClass(index) {
    switch (index) {
        case 1:
            return "fa-solid fa-face-dizzy";
        case 2:
            return "fa-solid fa-face-tired";
        case 3:
            return "fa-solid fa-face-meh";
        case 4:
            return "fa-solid fa-face-smile";
        case 5:
            return "fa-solid fa-face-grin-stars";
    }
}
function getHappinessColor(index) {
    switch (index) {
        case 1:
            return "#ff3300" // Faccina arrabbiata
        case 2:
            return "#ff8300"; // Faccina triste
        case 3:
            return "#FFD700"; // Faccina neutra
        case 4:
            return "#00ff5b"; // Faccina sorridente
        case 5:
            return "green"; // Faccina che ride
        default:
            return " ";
    }
}

const Banner = (props) => {
    const { restaurant } = props;
    const iconsData = [
        { to: `tel:${restaurant.phone}`, src: phoneImage, width: 40, height: 40 },
        { to: restaurant.website, src: webImage, width: 40, height: 40 },
        { to: restaurant.facebook, src: facebookImage, width: 45, height: 45 },
        { to: restaurant.instagram, src: instagramImage, width: 45, height: 45 },
        { to: restaurant.twitter, src: twitterImage, width: 40, height: 40 },
    ];

    // Used to show the restaurant rating based on the reviews
    const restaurantStars = () => {
        if (restaurant.reviews.length === 0) {
            return (
                <p>
                    <i className="bi bi-star" style={{ color: '#FFD700', marginRight: "5px"}}></i>
                    <i>No reviews yet</i>
                </p>
            );
        } else {
            const averageQuality = (restaurant.reviews.reduce( (sum, review) => sum + review.quality, 0)) / restaurant.reviews.length;
            const averageSafety = (restaurant.reviews.reduce( (sum, review) => sum + review.safety, 0)) / restaurant.reviews.length;
            // return Array.from({ length: Math.round(averageStars) }, (_, index) => ( <i key={index} className="bi bi-star-fill"></i> ));
            return (
                <h6>
                    Quality: <i className="bi bi-star-fill" style={{color: "#FFC107"}}></i> {averageQuality.toFixed(1)}
                    <br/>
                    Safety: <FontAwesomeIcon icon={getHappinessSolidClass(Math.round(averageSafety))} style={{color: getHappinessColor(Math.round(averageSafety))}} /> {averageSafety.toFixed(1)}
                </h6>
            );
        }
    }

    // Functions used to show the opening hours status based on real time
    const getOpeningHours = (openingHours) => {
        const currentDateTime = new Date();
        const currentDay = currentDateTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const currentHour = currentDateTime.getHours();
        const currentMinutes = currentDateTime.getMinutes();
        const currentTime = currentHour * 60 + currentMinutes;

        const dayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const dayRanges = openingHours.split('/');

        for (const dayRange of dayRanges) {
            const [dayAbbreviation, ranges] = dayRange.split('=');
            const dayIndex = dayAbbreviations.indexOf(dayAbbreviation);

            if (dayIndex === currentDay) {
                const dayTimeRanges = ranges.split(';').map(range => {
                    const [start, end] = range.split('-').map(time => {
                        const [hours, minutes] = time.split(':').map(Number);
                        return hours * 60 + minutes;
                    });
                    return { start, end };
                });

                for (const { start, end } of dayTimeRanges) {
                    if (
                        (currentTime >= start && currentTime <= end) ||
                        (end >= 0 && end <= 420 && currentTime >= start && currentTime >= end)
                    ) {
                        return `Open now (closes at ${formatTime(end)})`;
                    }
                }

                const nextOpeningTime = dayTimeRanges.reduce((closestTime, { start }) => {
                    return start > currentTime && (start < closestTime || closestTime === -1) ? start : closestTime;
                }, -1);

                if (nextOpeningTime !== -1) {
                    return `Closed now (opens at ${formatTime(nextOpeningTime)})`;
                }
            }
        }

        // Business is closed today, find the next opening day and time
        for (let i = 1; i <= 7; i++) {
            const nextDayIndex = (currentDay + i) % 7;
            const nextDayRanges = dayRanges.find(range => dayAbbreviations[nextDayIndex] === range.split('=')[0]);

            if (nextDayRanges) {
                const nextOpeningTime = nextDayRanges.replace(`${dayAbbreviations[nextDayIndex]}=`, '').split(';')[0].split('-')[0];
                const opensTomorrow = i === 1;
                if (!opensTomorrow)
                    return `Closed today, opens on ${fullDays[nextDayIndex]} at ${nextOpeningTime}`;
                else
                    return `Closed today, opens tomorrow at ${nextOpeningTime}`;
            }
        }
        // If no information for the current day or future days, return a default message
        return 'No information available for today or the next days';
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
        if (img.width !== 0 && window.innerWidth > img.width)
            return window.innerWidth / img.width;
        else
            return 1;
    }


    return(
        <>
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>
            <div style={{ position: 'relative', overflow: 'hidden', height: "148px", padding: "0.2rem 0.2rem 0.5rem 0.5rem" }}>
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
                <Stack direction={"horizontal"}>
                    <Col xs={"auto"} style={{textAlign: "start", marginTop: "0.2rem"}}> {restaurantStars()} </Col>
                    <Col xs={"auto"} className="ms-auto" style={{textAlign: "end", marginBottom: "0.4rem"}}>
                        {iconsData.map((icon, index) => (
                            icon.to && (
                                <Link key={index} style={{ marginLeft: "0.4rem" }} to={icon.to}>
                                    <img width={icon.width} height={icon.height} src={icon.src} />
                                </Link>
                            )
                        ))}
                    </Col>
                </Stack>
                <Row>
                    <h6><FontAwesomeIcon icon="fa-solid fa-location-dot" /> {address_string_to_object(restaurant.location).text} </h6>
                </Row>
                <Row>
                    <h6><FontAwesomeIcon icon="fa-solid fa-clock" /> {getOpeningHours(restaurant.hours)} </h6>
                </Row>
            </div>
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>
        </>
    );
}


const BannerProfile = (props) => {
    const { restaurant } = props;
    const navigate = useNavigate();

    // Used to show the restaurant rating based on the reviews
    const restaurantStars = () => {
        if (restaurant.reviews.length === 0) {
            return (
                <p>
                    <i className="bi bi-star" style={{ color: '#FFD700', marginRight: "5px"}}></i>
                    <i>No reviews yet</i>
                </p>
            );
        } else {
            const averageQuality = (restaurant.reviews.reduce( (sum, review) => sum + review.quality, 0)) / restaurant.reviews.length;
            const averageSafety = (restaurant.reviews.reduce( (sum, review) => sum + review.safety, 0)) / restaurant.reviews.length;
            // return Array.from({ length: Math.round(averageStars) }, (_, index) => ( <i key={index} className="bi bi-star-fill"></i> ));
            return (
                <h6>
                    Quality: <i className="bi bi-star-fill" style={{color: "#FFC107"}}></i> {averageQuality.toFixed(1)}
                    <br/>
                    Safety: <FontAwesomeIcon icon={getHappinessSolidClass(Math.round(averageSafety))} style={{color: getHappinessColor(Math.round(averageSafety))}} /> {averageSafety.toFixed(1)}
                </h6>
            );
        }
    }

    // Functions used to show the opening hours status based on real time
    const getOpeningHours = (openingHours) => {
        const currentDateTime = new Date();
        const currentDay = currentDateTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const currentHour = currentDateTime.getHours();
        const currentMinutes = currentDateTime.getMinutes();
        const currentTime = currentHour * 60 + currentMinutes;

        const dayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const dayRanges = openingHours.split('/');

        for (const dayRange of dayRanges) {
            const [dayAbbreviation, ranges] = dayRange.split('=');
            const dayIndex = dayAbbreviations.indexOf(dayAbbreviation);

            if (dayIndex === currentDay) {
                const dayTimeRanges = ranges.split(';').map(range => {
                    const [start, end] = range.split('-').map(time => {
                        const [hours, minutes] = time.split(':').map(Number);
                        return hours * 60 + minutes;
                    });
                    return { start, end };
                });

                for (const { start, end } of dayTimeRanges) {
                    if (
                        (currentTime >= start && currentTime <= end) ||
                        (end >= 0 && end <= 420 && currentTime >= start && currentTime >= end)
                    ) {
                        return `Open now (closes at ${formatTime(end)})`;
                    }
                }

                const nextOpeningTime = dayTimeRanges.reduce((closestTime, { start }) => {
                    return start > currentTime && (start < closestTime || closestTime === -1) ? start : closestTime;
                }, -1);

                if (nextOpeningTime !== -1) {
                    return `Closed now (opens at ${formatTime(nextOpeningTime)})`;
                }
            }
        }

        // Business is closed today, find the next opening day and time
        for (let i = 1; i <= 7; i++) {
            const nextDayIndex = (currentDay + i) % 7;
            const nextDayRanges = dayRanges.find(range => dayAbbreviations[nextDayIndex] === range.split('=')[0]);

            if (nextDayRanges) {
                const nextOpeningTime = nextDayRanges.replace(`${dayAbbreviations[nextDayIndex]}=`, '').split(';')[0].split('-')[0];
                const opensTomorrow = i === 1;
                if (!opensTomorrow)
                    return `Closed today, opens on ${dayAbbreviations[nextDayIndex]} at ${nextOpeningTime}`;
                else
                    return `Closed today, opens tomorrow at ${nextOpeningTime}`;
            }
        }
        // If no information for the current day or future days, return a default message
        return 'No information available for today or the next days';
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
        if (img.width !== 0 && window.innerWidth > img.width)
            return window.innerWidth / img.width;
        else
            return 1;
    }


    return(
        <>
            <div style={{borderTop: "1px solid #000", margin: 0}} ></div>
            <Container fluid style={{ position: 'relative', overflow: 'hidden', height: "174px", borderLeft: '1px solid #000', borderRight: '1px solid #000', color: 'black' }} onClick={() => navigate('/restaurants/1/menu')}>
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
                    <h1 style={{fontSize: '2rem', marginTop: '10px'}}> <b><i> {restaurant.name} </i></b> </h1>
                </Row>
                <Row>
                    <Col xs={5} style={{marginTop: "0.4rem"}}> {restaurantStars()} </Col>
                </Row>
                <Row>
                    <h6><FontAwesomeIcon icon="fa-solid fa-location-dot" /> {address_string_to_object(restaurant.location).text} </h6>
                </Row>
                <Row style={{whiteSpace: "nowrap"}}>
                    <h6><FontAwesomeIcon icon="fa-solid fa-clock" /> {getOpeningHours(restaurant.hours)} </h6>
                </Row>
            </Container>
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>
        </>
    );
}

const Menu = (props) => {
    const { restaurant } = props;
    const navigate = useNavigate();

    const allDishTypes = [...new Set(restaurant.dishes.map(dish => dish.type))];
    const [type, setType] = useState(allDishTypes[0]);
    const [search, setSearch] = useState("");
    const [filteredDishes, setFilteredDishes] = useState(restaurant.dishes);
    // const [ingredient, setIngredient] = useState(null);
    // const [modalIngredientShow, setModalIngredientShow] = useState(false);
    // const [dishIngredients, setDishIngredients] = useState(null);
    // const [modalDishShow, setModalDishShow] = useState(false);
    const menuHeight = (window.innerHeight - 356);


    const handleSearch = (ev) => {
        setSearch(ev.target.value);
        setFilteredDishes(restaurant.dishes.filter((dish) =>
            (dish.name.toLowerCase().includes(ev.target.value.trim().toLowerCase()))
            ||
            (dish.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(ev.target.value.trim().toLowerCase())))
        ));
    }

    // const fetchIngredient = async (id) => {
    //     try {
    //         const ingredient = await API.getIngredient(id);
    //         setIngredient(ingredient);
    //         setModalIngredientShow(true);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // function IngredientModal(props) {
    //     let allergens = [];
    //
    //     if(!ingredient)
    //         return null;
    //
    //     if(ingredient.allergens !== null)
    //         allergens = ingredient.allergens.split(',').map(allergen => allergen.trim());
    //
    //
    //     return(
    //         <Modal {...props} size="lg" centered>
    //             <Modal.Header closeButton>
    //                 <Modal.Title> <i> {ingredient.name} </i> </Modal.Title>
    //             </Modal.Header>
    //             <Modal.Body>
    //                 <Row>
    //                     <Col>
    //                         { allergens.length === 0 ?
    //                             <h5 style={{marginTop: "0.4rem"}}> No allergens </h5>
    //                             :
    //                             allergens.map((allergen, index) => (
    //                                 <h5 key={index} style={{marginTop: "0.4rem"}}>
    //                                     <Badge style={{borderRadius: 20}} bg={ allergen === "lactose" ? "info" : allergen === "pork" ? "secondary" : allergen === "gluten" ? "danger" : "primary"}>
    //                                         { allergen === "gluten" ?
    //                                             <>
    //                                                 <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" /> {allergen}
    //                                             </>
    //                                             :
    //                                             allergen
    //                                         }
    //                                     </Badge>
    //                                 </h5>
    //                             ))
    //                         }
    //                         { ingredient.brandLink === null ?
    //                             <h5 style={{marginTop: "3rem"}}>
    //                                 {ingredient.brandName}
    //                             </h5>
    //                             :
    //                             <>
    //                                 <h6 style={{marginTop: "3rem"}}>
    //                                     Brand :
    //                                 </h6>
    //                                 <Button variant="light" size="lg" className="custom-link-button" href={ingredient.brandLink}> {ingredient.brandName} </Button>
    //                             </>
    //                         }
    //                     </Col>
    //                     <Col style={{textAlign: "end"}}>
    //                         <img height={"130px"} width={"130px"} src={ingredient.image} />
    //                     </Col>
    //                 </Row>
    //             </Modal.Body>
    //         </Modal>
    //     );
    // }
    //
    // function DishModal(props) {
    //     if(!dishIngredients)
    //         return null;
    //
    //     return(
    //         <Modal {...props} style={{marginTop: 54}}>
    //             <Modal.Header closeButton />
    //             <Modal.Body style={{maxHeight: window.innerHeight - 170, overflowY: "scroll"}}>
    //                 <Row>
    //                     <Col style={{textAlign: "center"}}>
    //                         <img width={window.innerWidth - 100} src={dishIngredients.image} />
    //                         <div style={{borderTop: "1px solid #D3D3D3", margin: 0, marginBottom: "0.4rem", marginTop: "1rem"}}></div>
    //                     </Col>
    //                 </Row>
    //                 <Modal.Title as={"h1"} style={{textAlign: "center"}}>
    //                     {dishIngredients.name}
    //                 </Modal.Title>
    //                 <Row>
    //                     <Col style={{textAlign: "center"}}>
    //                         <Badge pill bg="success"> {dishIngredients.type} </Badge>
    //                     </Col>
    //                 </Row>
    //                 <Row>
    //                     <Col style={{textAlign: "center", marginLeft: "0.4rem", marginTop: "0.4rem"}}>
    //                         <i><b>{dishIngredients.price}<i className="bi bi-currency-euro"></i></b></i>
    //                     </Col>
    //                 </Row>
    //                 {dishIngredients.ingredients.length !== 0 ?
    //                     <Modal.Title as={"h5"} style={{textAlign: "center", marginTop: "2rem", marginBottom: "0.4rem"}}>
    //                         Ingredients
    //                     </Modal.Title>
    //                     :
    //                     <></>
    //                 }
    //                 {
    //                     dishIngredients.ingredients.map((ingredient, index) => {
    //                         let allergens = [];
    //
    //                         if(ingredient.allergens !== null)
    //                             allergens = ingredient.allergens.split(',').map(allergen => allergen.trim());
    //
    //                         return (
    //                             <div key={index}>
    //                                 <div style={{borderTop: "1px solid #D3D3D3", margin: 0}} ></div>
    //                                 <Row>
    //                                     <Col as={"h4"} style={{marginTop: "1.4rem"}}>
    //                                         <i>{ingredient.name}</i>
    //                                     </Col>
    //                                 </Row>
    //                                 <Row style={{marginBottom: "1.4rem"}}>
    //                                     <Col>
    //                                         { allergens.length === 0 ?
    //                                             <h6 style={{marginTop: "1rem"}}> No allergens </h6>
    //                                             :
    //                                             allergens.map((allergen, index) => (
    //                                                 <h5 key={index} style={{marginTop: "0.4rem"}}>
    //                                                     <Badge style={{borderRadius: 20}} bg={ allergen === "lactose" ? "info" : allergen === "pork" ? "secondary" : allergen === "gluten" ? "danger" : "primary"}>
    //                                                         { allergen === "gluten" ?
    //                                                             <>
    //                                                                 <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" /> {allergen}
    //                                                             </>
    //                                                             :
    //                                                             allergen
    //                                                         }
    //                                                     </Badge>
    //                                                 </h5>
    //                                             ))
    //                                         }
    //                                         { ingredient.brandLink === null ?
    //                                             <h5 style={{marginTop: "3rem"}}>
    //                                                 {ingredient.brandName}
    //                                             </h5>
    //                                             :
    //                                             <>
    //                                                 <h6 style={{marginTop: "3rem"}}>
    //                                                     Brand :
    //                                                 </h6>
    //                                                 <Button variant="light" size="lg" className="custom-link-button" href={ingredient.brandLink}> {ingredient.brandName} </Button>
    //                                             </>
    //                                         }
    //                                     </Col>
    //                                     <Col style={{textAlign: "end"}}>
    //                                         <img height={"130px"} width={"130px"} src={ingredient.image} />
    //                                     </Col>
    //                                 </Row>
    //                             </div>
    //                         );
    //                     })
    //                 }
    //             </Modal.Body>
    //         </Modal>
    //     )
    // }


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
                    <Button key={index} active={currentType === type} onClick={() => setType(currentType)} size="lg" style={{margin: "0.4rem", borderRadius: 30, backgroundColor: currentType === type ? "#52b69a" : "#fff", borderColor: "#52b69a", color: currentType === type ? "#fff" : "#52b69a", border: 0}}>
                        {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
                    </Button>
                ))}
            </Col>
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>

            {/*Menu dishes*/}
            <ListGroup className="scroll" style={{overflowY: "scroll", maxHeight: menuHeight}}>
                { filteredDishes.filter((dish) => dish.type === type).length === 0 ?
                    <p style={{marginTop: "1rem", marginLeft: "0.4rem"}}> No result for "<b>{search.trim()}</b>" in this menu section! </p>
                    :
                    filteredDishes.filter((dish) => dish.type === type).map((dish) => {
                    return (
                        <Card key={dish.id} style={{borderRadius: 0, borderTop: 0}} onClick={() => navigate(`/restaurants/${restaurant.id}/menu/dish/${dish.id}`)}>
                            <Button variant="light" style={{padding: "0 0 0 0"}}>
                                <Card.Body>
                                    <Row>
                                        <Col style={{textAlign: "start"}}>
                                            <Card.Title> {dish.name} </Card.Title>
                                            <Card.Text>
                                                {
                                                    dish.ingredients.map((ingredient, index) => (
                                                        <span key={index}>
                                                            <span style={{whiteSpace: "nowrap"}}>{ingredient.name}</span>
                                                            {index < dish.ingredients.length - 1 && ', '}
                                                        </span>
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
                            </Button>
                        </Card>
                    );
                })}
            </ListGroup>

            {/*Ingredient modal*/}
            {/*<IngredientModal show={modalIngredientShow} onHide={() => setModalIngredientShow(false)} />*/}
            {/*Dish modal*/}
            {/*<DishModal show={modalDishShow} onHide={() => setModalDishShow(false)} />*/}
        </>
    );
}

const Details = (props) => {
    const { restaurant } = props;
    const descriptionHeight = (window.innerHeight - 495);

    function formatTimeRanges(input) {
        let groupedByDay = {};

        time_string_to_object(input).forEach(({ day, first, last }) => {
            const timeRange = `${first}-${last}`;

            if (groupedByDay[day])
                groupedByDay[day].push(timeRange);
            else
                groupedByDay[day] = [timeRange];
        });


        return (
            <>
                {Object.entries(groupedByDay).map((day, index) => {
                    return (
                        <div key={index}>
                            <Row>
                                <Col>
                                    {day[0]}
                                </Col>
                                <Col style={{textAlign: "end"}}>
                                    {day[1].map((range, index) => <div key={index} style={{marginBottom: "0.4rem"}}> {range}<br/> </div> )}
                                </Col>
                            </Row>
                            {index < Object.entries(groupedByDay).length - 1 && <div style={{borderTop: "1px solid #D3D3D3", margin: 0, marginBottom: "0.4rem"}} ></div>}
                        </div>
                    );
                })}
            </>
        );
    }


    return(
        <>
            {/*Description*/}
            <Card style={{borderRadius: 0, borderBottom: 0}}>
                <Card.Header as="h5" style={{textAlign: "center"}}>
                    Description
                </Card.Header>
                <Card.Body style={{overflowY: "auto", maxHeight: descriptionHeight}}>
                    <Card.Text>
                        {restaurant.description}
                    </Card.Text>
                </Card.Body>

                {/*Opening Hours*/}
                <div style={{borderTop: "1px solid #000", margin: 0}}></div>
                <Card.Header as="h5" style={{textAlign: "center"}}>
                    Opening Hours
                </Card.Header>
                <Card.Body style={{overflowY: "auto", maxHeight: 160}}>
                    <Card.Title as="h6">
                        {formatTimeRanges(restaurant.hours)}
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    );
}


function Restaurant() {
    const { id } = useParams();
    const handleError = useContext(ErrorContext);
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
                setRestaurant(restaurant);
            } catch (error) {
                handleError(error);
            }
        }

        getRestaurant();
    }, [id]);


    return (
        <>
            { restaurant && (
                <>
                    <Banner restaurant={restaurant} />
                    { menu ? (
                        <Menu restaurant={restaurant} />
                    ) : details ? (
                        <Details restaurant={restaurant} />
                    ) : (
                        <Reviews reviews={restaurant.reviews} />
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
export { Restaurant, BannerProfile };
