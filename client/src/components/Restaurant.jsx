import {useContext, useEffect, useRef, useState} from 'react'
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
import Select from "react-select";
import makeAnimated from "react-select/animated";


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
    const { restaurant, bannerRef, setDivHeight } = props;
    const iconsData = [
        { to: `tel:${restaurant.phone}`, src: phoneImage, width: 40, height: 40 },
        { to: restaurant.website, src: webImage, width: 40, height: 40 },
        { to: restaurant.facebook, src: facebookImage, width: 45, height: 45 },
        { to: restaurant.instagram, src: instagramImage, width: 45, height: 45 },
        { to: restaurant.twitter, src: twitterImage, width: 40, height: 40 },
    ];


    useEffect(() => {
        // Ref for responsive banner
        if (bannerRef) {
            setDivHeight(bannerRef.current.offsetHeight);
            console.log('Div Height:', bannerRef.current.offsetHeight);
        }
    }, [bannerRef]);


    // Used to show the restaurant rating based on the reviews
    const restaurantStars = () => {
        if (restaurant.reviews.length === 0) {
            return (
                <h6>
                    <i>No reviews yet</i>
                </h6>
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
            <div ref={bannerRef} style={{ position: 'relative', overflow: 'hidden', padding: "0.2rem 0.2rem 0.5rem 0.5rem" }}>
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
                <Row style={{maxHeight: 70}}>
                    <h1> <b><i>{restaurant.name}</i></b> </h1>
                </Row>
                <Row style={{maxHeight: 20}}>
                    { restaurant.reviews.length === 0 ?
                        <></>
                        :
                        restaurant.reviews.length === 1 ?
                            <h6>({restaurant.reviews.length} review)</h6>
                            :
                            <h6>({restaurant.reviews.length} reviews)</h6>
                    }
                </Row>
                <Stack direction={"horizontal"}>
                    <Col xs={"auto"} style={{textAlign: "start", marginTop: "0.2rem"}}> {restaurantStars()} </Col>
                    <Col xs={"auto"} className="ms-auto" style={{textAlign: "end", marginBottom: "0.4rem"}}>
                        {iconsData.map((icon, index) => (
                            icon.to && (
                                <Link key={index} target={"_blank"} style={{ marginLeft: "0.4rem" }} to={icon.to}>
                                    <img width={icon.width} height={icon.height} src={icon.src} />
                                </Link>
                            )
                        ))}
                    </Col>
                </Stack>
                <Row>
                    <h6><FontAwesomeIcon icon="fa-solid fa-location-dot" /> {address_string_to_object(restaurant.location).text} </h6>
                </Row>
                <Row style={{maxHeight: 15}}>
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
    const { restaurant, restaurantAllergens, setRestaurantAllergens, menuType, setFilteredSelectDishes, filteredDishes, setFilteredDishes, filteredSearchDishes, setFilteredSearchDishes, filteredSelectDishes, search, setSearch, divHeight } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const animatedComponents = makeAnimated();

    const allDishTypes = [...new Set(restaurant.dishes.map(dish => dish.type))];
    const keyType = 'selectedDishType';
    // Load the selected type from localStorage or use the first type
    const initialType = (location.state && location.state.previousLocationPathname === '/') ? allDishTypes[0] : (localStorage.getItem(keyType) || allDishTypes[0]);
    const [type, setType] = useState(menuType.length !== 0 ? menuType[0] : initialType);
    const allAllergens = [...new Set(restaurant.dishes.flatMap(dish => dish.ingredients.map(ingredient => ingredient.allergens)).filter(allergen => allergen !== null))];
    const optionsAllergens = allAllergens.map(allergen => ({ label: 'No ' + allergen, value: allergen }));
    const [selectedAllergens, setSelectedAllergens] = useState(restaurantAllergens.length !== 0 ? restaurantAllergens : []);

    const menuHeight = (divHeight === 166 ? window.innerHeight - 410 : divHeight === 195 ? window.innerHeight - 440 : divHeight === 175 ? window.innerHeight - 420 : window.innerHeight - 390);


    useEffect(() => {
        if (location.state && location.state.previousLocationPathname === '/') {
            localStorage.setItem('selectedSearch', "");
            localStorage.setItem(keyType, allDishTypes[0]);
        }
    }, [location.state]);
    
    
    const handleSearch = (ev) => {
        setSearch(ev.target.value);
        localStorage.setItem('selectedSearch', ev.target.value);

        setFilteredSearchDishes(restaurant.dishes.filter((dish) =>
            (dish.name.toLowerCase().includes(ev.target.value.trim().toLowerCase()))
            ||
            (dish.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(ev.target.value.trim().toLowerCase())))
        ));

        if (selectedAllergens.length === 0) {
            setFilteredDishes(restaurant.dishes.filter((dish) =>
                (dish.name.toLowerCase().includes(ev.target.value.trim().toLowerCase()))
                ||
                (dish.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(ev.target.value.trim().toLowerCase())))
            ));
        } else {
            setFilteredDishes(filteredSelectDishes.filter((dish) =>
                (dish.name.toLowerCase().includes(ev.target.value.trim().toLowerCase()))
                ||
                (dish.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(ev.target.value.trim().toLowerCase())))
            ));
        }
    }


    return(
        <>
            {/*Search bar component*/}
            <Row className="align-items-center" style={{marginRight: 0, marginTop:"0.2rem", marginLeft: 0, marginBottom: "0.2rem", height: "80px"}}>
                <Col xs={1} className="d-flex align-items-center" style={{marginRight:"2%"}}>
                    <i className="bi bi-search" style={{fontSize: "1.5rem"}}></i>
                </Col>
                <Col xs={10}>
                    <Form.Control type="search" placeholder="Search dish or ingredient" value={search} onChange={handleSearch}/>
                </Col>
                {/*Allergens multi-select*/}
                <Col style={{marginTop: "0.5rem"}}>
                    <Select
                        options={optionsAllergens}
                        value={selectedAllergens}
                        onChange={ev => {
                            setSelectedAllergens(ev);
                            setRestaurantAllergens(ev);

                            setFilteredSelectDishes(restaurant.dishes.filter(dish => !dish.ingredients.some(ingredient => ev.map(allergen => allergen.value).includes(ingredient.allergens))))

                            if (search.trim() === '')
                                setFilteredDishes(restaurant.dishes.filter(dish => !dish.ingredients.some(ingredient => ev.map(allergen => allergen.value).includes(ingredient.allergens))))
                            else
                                setFilteredDishes(filteredSearchDishes.filter(dish => !dish.ingredients.some(ingredient => ev.map(allergen => allergen.value).includes(ingredient.allergens))))
                        }}
                        isMulti
                        closeMenuOnSelect={false}
                        isSearchable={false}
                        isClearable={true}
                        placeholder="Choose Allergens to avoid"
                        components={animatedComponents}
                    />
                </Col>
            </Row>

            {/*Menu categories*/}
            <Col className="scroll" style={{ display: "flex", overflowX: "scroll"}}>
                {allDishTypes.map((currentType, index) => (
                    <Button key={index} active={currentType === type} size="lg" style={{margin: "0.4rem", borderRadius: 30, backgroundColor: currentType === type ? "#52b69a" : "#fff", borderColor: "#52b69a", color: currentType === type ? "#fff" : "#52b69a", border: 0}}
                            onClick={() => {
                                setType(currentType);
                                localStorage.setItem(keyType, currentType);
                            }
                    }>
                        {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
                    </Button>
                ))}
            </Col>
            <div style={{borderTop: "1px solid #000", margin: 0}}></div>

            {/*Menu dishes*/}
            <ListGroup className="scroll" style={{overflowY: "scroll", maxHeight: menuHeight}}>
                { filteredDishes.filter((dish) => dish.type === type).length === 0 ?
                    <>
                        { search.trim() === '' ?
                                <p style={{marginTop: "1rem", marginLeft: "1rem"}}> No result with the selected allergens in this menu section! </p>
                                :
                                <p style={{marginTop: "1rem", marginLeft: "0.4rem"}}> No result for "<b>{search.trim()}</b>" in this menu section! </p>
                        }
                    </>
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


function Restaurant({restaurantAllergens, setRestaurantAllergens, menuType}) {
    const { id } = useParams();
    const handleError = useContext(ErrorContext);
    const location = useLocation();
    const bannerRef = useRef(null);
    const [divHeight, setDivHeight] = useState(null);
    const regexDetails = /\/details$/;
    const regexMenu = /\/menu$/;
    const regexReviews = /\/reviews$/;
    const [restaurant, setRestaurant] = useState(null);
    const [filteredDishes, setFilteredDishes] = useState(null);
    const [filteredSearchDishes, setFilteredSearchDishes] = useState(null);
    const [filteredSelectDishes, setFilteredSelectDishes] = useState(null);
    const [menu, setMenu] = useState(regexMenu.test(location.pathname));
    const [details, setDetails] = useState(regexDetails.test(location.pathname));
    const [reviews, setReviews] = useState(regexReviews.test(location.pathname));
    const keySearch = 'selectedSearch';
    const initialSearch = (location.state && location.state.previousLocationPathname === '/') ? "" : (localStorage.getItem(keySearch) || "");
    const [search, setSearch] = useState(initialSearch);


    useEffect(() => {
        const getRestaurant = async () => {
            try {
                const restaurant = await API.getRestaurant(id);
                setRestaurant(restaurant);
                //
                setFilteredSearchDishes(restaurant.dishes.filter((dish) =>
                    (dish.name.toLowerCase().includes(search.trim().toLowerCase()))
                    ||
                    (dish.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(search.trim().toLowerCase())))
                ));
                setFilteredSelectDishes(restaurant.dishes.filter(dish => !dish.ingredients.some(ingredient => restaurantAllergens.map(allergen => allergen.value).includes(ingredient.allergens))));
                setFilteredDishes(restaurant.dishes.filter((dish) =>
                    !dish.ingredients.some((ingredient) =>
                        restaurantAllergens.map((allergen) => allergen.value).includes(ingredient.allergens)
                    ) &&
                    ((dish.name.toLowerCase().includes(search.trim().toLowerCase())) ||
                        (dish.ingredients.some((ingredient) =>
                            ingredient.name.toLowerCase().includes(search.trim().toLowerCase())
                        )))
                ));

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
                    <Banner restaurant={restaurant} bannerRef={bannerRef} setDivHeight={setDivHeight} />
                    { menu ? (
                        <Menu restaurant={restaurant} restaurantAllergens={restaurantAllergens} setRestaurantAllergens={setRestaurantAllergens} menuType={menuType}
                              filteredDishes={filteredDishes} setFilteredDishes={setFilteredDishes} filteredSearchDishes={filteredSearchDishes}
                              setFilteredSearchDishes={setFilteredSearchDishes} filteredSelectDishes={filteredSelectDishes} setFilteredSelectDishes={setFilteredSelectDishes}
                              search={search} setSearch={setSearch} divHeight={divHeight} />
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
