import { useState, useEffect,useContext } from 'react'
import { ErrorContext } from './userContext';
import API from '../API';
import { useNavigate } from 'react-router-dom'
import { ListGroup, Card, Col, Row, Button, Navbar, Container, Form, Badge, Fade } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Header } from './Header';
import { UserContext } from './userContext';
import dayjs from 'dayjs';
import InfoPopup from './InfoPopup';
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
  
function SearchBar(props) {
    const { search, setSearch, setRestaurantList, restaurantInitialList} = props;
    const navigate = useNavigate();
    const [showInfo, setShowInfo] = useState(false);

    const handleSearch = (ev) => {
        setSearch(ev.target.value);
        setRestaurantList(restaurantInitialList.filter((restaurant) =>
            (restaurant.name.toLowerCase().includes(ev.target.value.trim().toLowerCase()))
        ));
    }


    return (
        <>        <InfoPopup  show={showInfo} setShow={setShowInfo} action={() => {
          navigate('/')
        }} />
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
            <Row className="align-items-center" style={{ marginRight: 0, marginTop: "0.2rem", marginLeft: 0, marginBottom: "0.2rem" }}>
                <Col xs={6} style={{textAlign:"end"}}>
                <b>More info</b>
                </Col>
                <Col>
                <FontAwesomeIcon onClick={setShowInfo} style={{ fontSize: "2rem", color: "#007bff" }} icon="fa-solid fa-circle-info" />
                </Col>
            </Row>
            
        </>
    )
}


function Filters(props) {
    const { filters, setFilters, setFiltersToApply, fadeStates, setFadeStates } = props;
    // const [list, setList] = useState(initialList);

    function createClickHandler(filterKey, filterValue, index) {
        return () => {
            handleFadeClick(filterKey, index);
        };
    }
    
    const handleFadeClick = (filterKey, index) => {
        console.log(filterKey);
        // Start fade out effect for the specific button
        setFadeStates(prevStates => prevStates.map((state, idx) => idx === index ? false : state));
    
        setTimeout(() => {
            // Remove the specific filter and update fadeStates accordingly
            setFilters(prevFilters => prevFilters.filter((_, idx) => idx !== index));
            setFadeStates(prevStates => prevStates.filter((_, idx) => idx !== index));
    
            // Update filtersToApply based on the removed filter
            setFiltersToApply(currentFilters => {
                let updatedFilters = { ...currentFilters };
                console.log(updatedFilters.categories);
                console.log(filterKey);
                if (filterKey != 'priceRange' && 
                    filterKey != 'maxDistance' &&
                    filterKey != 'qualityRating' &&
                    filterKey != 'safetyRating' &&
                    filterKey != 'openNow' &&
                    filterKey != 'nearby' &&
                    filterKey != 'label' &&
                    filterKey != 'order'){

                }
                // Update your switch case to correctly identify and remove the filter
                switch (filterKey) {
                    case 'priceRange':
                        updatedFilters.priceRange = [0, 110]; // Reset or update as needed
                        break;
                    case 'maxDistance':
                        updatedFilters.maxDistance = ''; // Reset or update as needed
                        break;
                    case 'qualityRating':
                        updatedFilters.qualityRating = ''; // Reset or update as needed
                        break;
                    case 'safetyRating':
                        updatedFilters.safetyRating = ''; // Reset or update as needed
                        break;
                    case 'openNow':
                        updatedFilters.openNow = false; // Reset or update as needed
                        break;
                    case 'nearby':
                        updatedFilters.nearby = false; // Reset or update as needed
                        break;
                    case 'label':
                        updatedFilters.label = 'NOTHING'; // Reset or update as needed
                        break;
                    case 'order':
                        updatedFilters.order = ''; // Reset or update as needed
                        break;
                    default: //categories
                        if (filterKey.startsWith("No ")){
                            updatedFilters.allergens = updatedFilters.allergens.filter(item => item !== filterKey.split("No ")[1]);
                            break;
                        } else {
                            updatedFilters.categories = updatedFilters.categories.filter(item => item !== filterKey);
                            break;
                        }
                }
    
                return updatedFilters;
            });
    
        }, 300); // Set this to your fade out duration
    };
    
    
    


    return (
        <Container fluid className="scroll" style={{ marginTop: "0.4rem", display: "flex", overflowX: "auto" }}>
            {filters.map((filter, index) => (
            <h2 key={index}>
                <Fade in={fadeStates[index]}>
                    <Button active style={{ marginRight: "0.4rem", borderRadius: "10px", backgroundColor: "#52b69a", borderColor: "#52b69a", whiteSpace: "nowrap" }}>
                        {typeof filter === 'object' ? 
                            Object.entries(filter).map(([key, value], idx) => <span key={idx}>{`${value}`}</span>) : 
                            filter
                        }
                        <span style={{ marginLeft: "0.7rem", display: "inline-block" }} onClick={createClickHandler(typeof filter === 'object' ? Object.keys(filter)[0] : filter, typeof filter === 'object' ? filter[Object.keys(filter)[0]] : null, index)}>
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
    const { filterRestaurants, filters, search, filtersToApply, setFiltersToApply } = props;
    // Used for scrollable restaurant list
    const listHeight = ( filters.length === 0 ? (window.innerHeight - 104) : (window.innerHeight - 150));


    return (
        <ListGroup className="scroll" style={{overflowY: "auto", maxHeight: listHeight}}>
            { filterRestaurants().length === 0 ?
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
                                    <Card.Title style={{textAlign: "start"}}>
                                        {restaurant.name}
                                    </Card.Title>
                                    { !restaurant.avg_quality && !restaurant.avg_safety && !restaurant.avg_price ?
                                        <Card.Text style={{textAlign: "start", marginTop: "1rem"}}>
                                            <i className="bi bi-star" style={{ color: '#FFD700', marginRight: "5px"}}></i>
                                            No reviews yet
                                        </Card.Text>
                                        :
                                        <>
                                            <Card.Text style={{textAlign: "start"}}>
                                                {
                                                    Array.from({ length: Math.round(restaurant.avg_quality) }, (_, index) => (
                                                        <i key={index} className="bi bi-star-fill " style={{color: '#FFD700', marginRight:"5px", fontSize:"1.2em"}}></i>
                                                    ))
                                                }
                                            </Card.Text>

                                            <Card.Text style={{textAlign: "start"}}>
                                                {
                                                    Array.from({ length: Math.round(restaurant.avg_price) }, (_, index) => (
                                                        <i key={index} className="bi bi-currency-euro" style={{marginRight:"5px" , fontSize:"1.2em"}}></i>
                                                    ))
                                                }
                                            </Card.Text>
                                            <Card.Text style={{textAlign: "start"}}>
                                            <b>Safety: </b> <FontAwesomeIcon icon={getHappinessSolidClass(Math.round(restaurant.avg_safety))} style={{color: getHappinessColor(Math.round(restaurant.avg_safety))}} />  ({restaurant.avg_safety.toFixed(1)}/5.0)         
                                            </Card.Text>
                                        </>
                                    }
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
    const handleError = useContext(ErrorContext);
    const user = useContext(UserContext);
    const username = user && user.username;
    const [userAddress, setUserAddress] = useState({lat1: '', lon1: ''});
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
                console.log(restaurants);
                setRestaurantList(restaurants);
                setRestaurantInitialList(restaurants);
            } catch (error) {
                handleError(error);
            }
        };
        function getFilters() {
            try {
                const filters = convertToFilterArray();
                setFilters(filters);
                setFadeStates(filters.map(() => true));
            } catch (error) {
                handleError(error);
            }
        };

        getRestaurants();
        getFilters();
    }, []);

    useEffect(() => {
        // function used to retrieve restaurant information in detail
        async function getUser(username) {
            try {
                const user1 = await API.getUser(username);
                if (user1 != null) {
                    setUserAddress({ lat1: user1.position.split(";")[1], lon1: user1.position.split(";")[2], invalid: false });
                    //console.log(user);
                } else {
                    // Handle the case when the dish with dishId is not found
                    console.log('User not found');
                }
            } catch (err) {
                // show error message
                console.log(err);
            }
        };
        if (username) {
            getUser(username);
        }
      }, [username]);

    function calculateDistance(lat1, lon1, lat2, lon2) {
        // Radius of the Earth in kilometers
        const R = 6371;
    
        // Convert degrees to radians
        const radLat1 = lat1 * Math.PI / 180;
        const radLat2 = lat2 * Math.PI / 180;
    
        // Latitude and longitude differences in radians
        const deltaLat = radLat2 - radLat1;
        const deltaLon = (lon2 - lon1) * Math.PI / 180;
    
        // Haversine formula
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(radLat1) * Math.cos(radLat2) * 
                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c;
    }

    // Function to convert filtersToApply into an array
    const convertToFilterArray = () => {
        let filter = [];

        // Add each element of categories and ingredients to the filter array
        filter = filter.concat(props.filtersToApply.categories);
        let updatedAllergens = props.filtersToApply.allergens.map(allergen => "No " + allergen);
        filter = filter.concat(updatedAllergens);

        // Add other properties if they are not empty or in their default state
        let priceRangeLabel;
        if (props.filtersToApply.priceRange[0] !== 0 || props.filtersToApply.priceRange[1] !== 110) {
            if (props.filtersToApply.priceRange[0] == 100 && props.filtersToApply.priceRange[1] == 110) {
                priceRangeLabel = "100€+";
                filter.push({ priceRange: priceRangeLabel});
            } else if (props.filtersToApply.priceRange[1] === 110) {
                let lowerBound = props.filtersToApply.priceRange[0] === 0 ? 1 : props.filtersToApply.priceRange[0];
                priceRangeLabel = `${lowerBound}€ - ${props.filtersToApply.priceRange[1] - 10}€+`;
                filter.push({ priceRange: priceRangeLabel});
            } else {
                let lowerBound = props.filtersToApply.priceRange[0] === 0 ? 1 : props.filtersToApply.priceRange[0];
                priceRangeLabel = `${lowerBound}€ - ${props.filtersToApply.priceRange[1]}€`;
                filter.push({ priceRange: priceRangeLabel});
            }
        }
        
        if (props.filtersToApply.maxDistance !== '') {
            filter.push({ maxDistance: "Max distance: " + props.filtersToApply.maxDistance + "km"});
        }
        if (props.filtersToApply.qualityRating !== '') {
            if (props.filtersToApply.qualityRating != 5){
                filter.push({ qualityRating: "Quality: " + props.filtersToApply.qualityRating + " Stars & above"});
            } else {
                filter.push({ qualityRating: "Quality: " + props.filtersToApply.qualityRating + " Stars"});
            }
        }
        if (props.filtersToApply.safetyRating !== '') {
            if (props.filtersToApply.safetyRating != 5){
                filter.push({ safetyRating: "Safety: " + props.filtersToApply.safetyRating + " & above"});
            } else {
                filter.push({ safetyRating: "Safety: " + props.filtersToApply.safetyRating});
            }
        }
        if (props.filtersToApply.openNow) {
            filter.push({ openNow: "Open Now" });
        }
        if (props.filtersToApply.nearby) {
            filter.push({ nearby: "Nearby" });
        }
        if (props.filtersToApply.label != "NOTHING" && props.filtersToApply.order != '') {
            filter.push({ label: "SORTED BY " + props.filtersToApply.order + " " + props.filtersToApply.label });
        }

        return filter;
    };
    
    // Function to check if the restaurant is open
    const isRestaurantOpen = (openingHours, currentDay, currentTime) => {
        // Split the opening hours into days
        const days = openingHours.split('/');

        // Find the hours for the current day
        const dayHours = days.find(day => day.startsWith(currentDay));

        if (!dayHours) return false; // Day not found in the opening hours

        // Extract the hours for the current day
        const hours = dayHours.split('=')[1].split(';');

        // Check if currentTime is within any of the time ranges
        return hours.some(hourRange => {
            const [start, end] = hourRange.split('-');
            return currentTime >= start && currentTime <= end;
        });
    };

    /*
    * Function to filter the restaurants based on the selected filters for the home page
    */
    function filterRestaurants() {
        let filteredRestaurants = [];
    
        restaurantList.forEach(restaurant => {
            let passesAllFilters = true;
            
            // Price Range Filter
            if (props.filtersToApply.priceRange[0] > 0 || props.filtersToApply.priceRange[1] < 110) {
                if (restaurant.dishes_avg_price < props.filtersToApply.priceRange[0] ||
                    (props.filtersToApply.priceRange[1] !== 110 && restaurant.dishes_avg_price > props.filtersToApply.priceRange[1])) {
                    passesAllFilters = false;
                }
            }

            // Categories Filter
            if (passesAllFilters && props.filtersToApply.categories.length > 0) {
                const hasMatchingCategory = props.filtersToApply.categories.some(filter_category => 
                    restaurant.dishes.some(dish => 
                        dish.type.toLowerCase() == filter_category.toLowerCase()
                    )
                );
                if (!hasMatchingCategory) {
                    passesAllFilters = false;
                }
            }
    
            // Quality Rating Filter
            if (passesAllFilters && props.filtersToApply.qualityRating !== '' && 
                Math.round(restaurant.avg_quality) < props.filtersToApply.qualityRating) {
                passesAllFilters = false;
            }
    
            // Safety Rating Filter
            if (passesAllFilters && props.filtersToApply.safetyRating !== '' &&
                Math.round(restaurant.avg_safety) < props.filtersToApply.safetyRating) {
                passesAllFilters = false;
            }
    
            // Allergens Filter --> IN THIS WAY WE SHOW UP ALL THE RESTAURANTS THAT HAVE AT LEAST ONE DISH (DRINKS EXCLUDED) WITHOUT THE SPECIFIED ALLERGENS
            if (passesAllFilters && props.filtersToApply.allergens.length > 0) {
                // Check if every dish contains an allergen; if not, the restaurant passes the filter
                const allDishesContainAllergen = restaurant.dishes.every(dish => {
                    // Skip checking allergens for dishes in the "drinks" category
                    if (dish.type.toLowerCase() == "drinks") {
                        return true;
                    }
                    // Check if the dish contains any of the specified allergens
                    return props.filtersToApply.allergens.some(filter_allergen => 
                        dish.allergens.map(allergen => allergen.toLowerCase()).includes(filter_allergen.toLowerCase())
                    );
                });

                // If every dish (excluding drinks) contains an allergen, then the restaurant does not pass the filter
                if (allDishesContainAllergen) {
                    passesAllFilters = false;
                }
            }

    
            // Open Now Filter
            if (passesAllFilters && props.filtersToApply.openNow) {
                let currentDayOfTheWeek = dayjs().format('ddd'); // Outputs the first three letters of the day of the week, e.g., 'Mon'
                let currentTime = dayjs().format('HH:mm'); // Outputs the time in hours and minutes
                
                // Check if the restaurant is open
                const isOpen = isRestaurantOpen(restaurant.hours, currentDayOfTheWeek, currentTime);
                if (!isOpen) {
                    passesAllFilters = false;
                }
            }            
    
            // If the restaurant passes all filters, add it to the filteredRestaurants list
            if (passesAllFilters) {
                filteredRestaurants.push(restaurant);
            }
        });

         // Max Distance Filter
        //  if (passesAllFilters && props.filtersToApply.maxDistance !== '') {
        //     let lat2 = restaurant.location.split(";")[1].replace("lat:", "");
        //     let lon2 = restaurant.location.split(";")[2].replace("lng:", "");
        //     if (calculateDistance(userAddress.lat1.replace("lat:", ""), userAddress.lon1.replace("lng:", ""), lat2, lon2) > parseFloat(props.filtersToApply.maxDistance)){
        //         passesAllFilters = false;
        //     }
        // }

        //BAD CODING BY TANUCC
        if (props.filtersToApply.label != 'NOTHING') {
            const field = props.filtersToApply.label === "REVIEW QUALITY" ? "avg_quality" : props.filtersToApply.label === "REVIEW PRICE" ? "avg_price" : "avg_safety";
            const order = props.filtersToApply.order;
            //SORT BY TANUCC
            const sortedList = order === 'ASC' ?
            filteredRestaurants.sort((a, b) => a[field]===null ?1 : a[field] - b[field])
            :
            filteredRestaurants.sort((a, b) => b[field] - a[field])
            filteredRestaurants = sortedList;
            //console.log(field,order)
            // console.log(filteredRestaurants)
        }

        //Nearby AND Max Distance Filter
        let nearby;
        if (props.filtersToApply.nearby == true) {
            nearby = 2;
        } 
        if (props.filtersToApply.maxDistance != '') {
            nearby = parseFloat(props.filtersToApply.maxDistance);
        } 
        if (props.filtersToApply.nearby == true || props.filtersToApply.maxDistance != '') {
            // Map restaurants to include calculated distances
            filteredRestaurants = filteredRestaurants
                .map(restaurant => {
                    let lat2 = parseFloat(restaurant.location.split(";")[1].replace("lat:", ""));
                    let lon2 = parseFloat(restaurant.location.split(";")[2].replace("lng:", ""));
                    let distance = calculateDistance(
                        parseFloat(userAddress.lat1.replace("lat:", "")), 
                        parseFloat(userAddress.lon1.replace("lng:", "")), 
                        lat2, 
                        lon2
                    );
                    return { ...restaurant, distance };
                });

            // Log distances for debugging
            console.log("Distances before sorting:", filteredRestaurants.map(r => r.distance));

            // Filter and sort by distance
            filteredRestaurants = filteredRestaurants
                .filter(restaurant => restaurant.distance <= nearby)
                .sort((a, b) => a.distance - b.distance);

                console.log("Distances before sorting:", filteredRestaurants.map(r => r.distance));
        }

        // Log the sorted restaurants
        console.log("Filtered and sorted restaurants:", filteredRestaurants);

        return filteredRestaurants;
    }
    

    return (
        <>
            <SearchBar search={search} setSearch={setSearch} setRestaurantList={setRestaurantList} restaurantInitialList={restaurantInitialList} />
            <Filters filters={convertToFilterArray()} setFilters={setFilters} setFiltersToApply={props.setFiltersToApply} fadeStates={fadeStates} setFadeStates={setFadeStates} />
            <RestaurantsList filterRestaurants={filterRestaurants} filters={filters} search={search} filtersToApply={props.filtersToApply} setFiltersToApply={props.setFiltersToApply}/>
        </>
    );
}
export { Home, Header,SearchBar };
