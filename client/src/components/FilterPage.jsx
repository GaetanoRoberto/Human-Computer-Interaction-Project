import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Fade ,Dropdown,DropdownButton} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ToggleButton from 'react-bootstrap/ToggleButton';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Range } from 'react-range';
import PositionModal from './PositionModal';
import PositionModalAlert from './PositionModalAlert';
import { UserContext,ErrorContext } from './userContext';
import API from '../API';


const animatedComponents = makeAnimated();

const FilterPage = (props) => {
    const handleError = useContext(ErrorContext);
    const user = useContext(UserContext);
    const username = user && user.username;
    const [userAddress, setUserAddress] = useState("");
    const { filtersToApply, setFiltersToApply } = props;
    const [tempFilters, setTempFilters] = useState({ ...filtersToApply });
    const [menuOpen, setMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [fadeStates, setFadeStates] = useState([]);
    const [locationError, setLocationError] = useState(false);
    const [errorMaxDistance, setErrorMaxDistance] = useState("");
    const navigate = useNavigate();

    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    function handleLocationClick() {
        setIsLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
        } else {
            //console.log("Geolocation not supported");
            setIsLoadingLocation(false);
        }
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // const defaultLocation = "Corso Duca degli Abruzzi, 24, Turin, Metropolitan City of Turin, Italy"; 
        // setAddress({ text: defaultLocation, lat: latitude, lng: longitude, invalid: false });

        //REMOVE THE FOLLOWING COMMENTS TO CONVERT LATITUDE AND LONGITUDE IN THE CURRENT ADDRESS (EXPLOITING GOOGLE MAPS API)
        return new Promise((resolve, reject) => {
            const geocoder = new google.maps.Geocoder();
            const latLng = { lat: latitude, lng: longitude };

            geocoder.geocode({ location: latLng }, async (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    props.setAddress({ text: results[0].formatted_address, lat: latitude, lng: longitude, invalid: false });

                    const location = results[0].formatted_address + ';lat:' + latitude + ";lng:" + longitude;
                    const updatedUser = {
                        position: location,
                        isRestaurateur: props.selectedStatus == "User" ? 0 : 1,
                        username: props.selectedStatus == "User" ? "User" : "Restaurateur",
                    };
                    //console.log(updatedUser);

                    // Now call the updateUser API with the updated user information
                    try {
                        await API.updateUser(updatedUser); // Assuming updateUser returns a promise
                        resolve(updatedUser); // Resolve with undefined for a valid address
                    } catch (error) {
                        //console.error("Failed to update user:", error);
                        reject(error); // Reject with the error
                    }
                } else {
                    props.setAddress({ text: results[0].formatted_address, lat: latitude, lng: longitude, invalid: true });
                    reject(true); // Resolve with true for an invalid address
                    //reject('Geocode was not successful for the following reason: ' + status);
                }
            });
        }).finally(() => {
            setIsLoadingLocation(false); // Set loading state to false when the geocoding is complete
            //setTempFilters({ ...tempFilters, nearby: true })
            setLocationError(false);
            setShowModal2(true);
        });
    }

    function error(err) {
        setIsLoadingLocation(true); // Assuming you want to show loading before the error

        // Simulate 1 second loading before showing the error
        setTimeout(() => {
            setIsLoadingLocation(false);
            setLocationError(true);
            setShowModal2(true);
            setTempFilters((prevFilters) => ({
                ...prevFilters,
                nearby: false,
                maxDistance:  ''
            }));
            console.log("Unable to retrieve your location");
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }, 1000); // 1000 milliseconds = 1 second
    }
    // Initialize fadeStates array when filters.allergens change
    useEffect(() => {
        const initialStates = filtersToApply.allergens.map(() => true);
        setFadeStates(initialStates);
    }, [filtersToApply.allergens]);

    useEffect(() => {
        // function used to retrieve restaurant information in detail
        async function getUser(username) {
            try {
                const user1 = await API.getUser(username);
                if (user1 != null) {
                    setUserAddress(user1.position.split(";")[0]);
                    //console.log(user);
                } else {
                    // Handle the case when the user
                    handleError('User not found');
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

    const handleRemoveFilters = () => {
        setTempFilters({categories: [],
            priceRange: [0, 110],
            maxDistance: '',
            qualityRating: '',
            safetyRating: '', 
            allergens: [], // Array to hold added ingredients
            openNow: false,
            nearby: false,
            label: "Nothing",
            order: "DESC"
        });
        //SE VOLESSI RIMUOVERE ANCHE I FILTRI GIà SELEZIONATI PRECEDENTEMENTE
        // if ((filtersToApply.categories.length === 0) &&
        //     (filtersToApply.priceRange[0] === 0 && filtersToApply.priceRange[1] === 110) &&
        //     (filtersToApply.maxDistance === '') &&
        //     (filtersToApply.qualityRating === '') &&
        //     (filtersToApply.safetyRating === '') &&
        //     (filtersToApply.allergens.length === 0) && // Added check for allergens
        //     (filtersToApply.openNow === false) &&
        //     (filtersToApply.nearby === false) &&
        //     (filtersToApply.label === "NOTHING") &&
        //     (filtersToApply.order === "DESC")) {
        //         setFiltersToApply({
        //             categories: [],
        //             priceRange: [0, 110],
        //             maxDistance: '',
        //             qualityRating: '',
        //             safetyRating: '', 
        //             allergens: [], // Array to hold added ingredients
        //             openNow: false,
        //             nearby: false,
        //             label: "NOTHING",
        //             order: "DESC"
        //         });
        // }
        //console.log(filtersToApply);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const mapToCategoriesOptions = (array) => {
        return array.map((item) => ({
            value: capitalizeFirstLetter(item),
            label: capitalizeFirstLetter(item)
        }));
    };

    const mapToAllergensOptions = (array) => {
        return array.map((item) => ({
            value: capitalizeFirstLetter(item),
            label: capitalizeFirstLetter(item)
        }));
    };

    useEffect(() => {
        // function used to retrieve restaurant information in detail
        async function getCategoriesAndAllergenes() {
            try {
                const categoriesAndAllergenes = await API.getFilteringInfos();
                //console.log(categoriesAndAllergenes);
                if (categoriesAndAllergenes != null) {
                    // Example of how to use this function when setting the state
                    props.setCategoriesOptions(mapToCategoriesOptions(categoriesAndAllergenes.categories));
                    props.setAllergensOptions(mapToAllergensOptions(categoriesAndAllergenes.allergens));
                    //setUserAddress(user1.position.split(";")[0]);
                    //console.log(user);
                } else {
                    // Handle the case when the filtering infos are not found
                    handleError('Infos not found');
                }
            } catch (err) {
                // show error message
                handleError(err);
            }
        };
        getCategoriesAndAllergenes();
    }, []);

    // const categoriesOptions = [
    //     { value: 'Desserts', label: 'Desserts' },
    //     { value: 'Drinks', label: 'Drinks' },
    //     { value: 'Hamburger', label: 'Hamburger' },
    //     { value: 'Pasta', label: 'Pasta' },
    //     { value: 'Pizza', label: 'Pizza' },
    // ]

    // const allergensOptions = [
    //     { value: 'Lactose', label: 'Lactose' },
    //     { value: 'Gluten', label: 'Gluten' },
    //     { value: 'Nickel', label: 'Nickel' },
    // ]

    const handleCategoryChange = (selectedOptions) => {
        setTempFilters((prevFilter) => ({
            ...prevFilter,
            categories: selectedOptions.map((option) => option.value),
        }));
        //console.log(filtersToApply);
    };

    const handleIngredientChange = (selectedOptions) => {
        setTempFilters((prevFilter) => ({
            ...prevFilter,
            allergens: selectedOptions.map((option) => option.value),
        }));
    };

    function isNegativeNumber(str) {
        // Check if the string is exactly a single "-"
        if (str === "-") {
            return true;
        }

        // Parse the string to a number
        const num = parseFloat(str);

        // Check if the parsed number is a valid number and is less than zero
        return !isNaN(num) && num < 0;
    }

    const validateMaxDistance = () => {
        if (isNegativeNumber(tempFilters.maxDistance)) {
            setErrorMaxDistance("Distance not valid!");
        } else {
            setErrorMaxDistance("");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setTempFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    useEffect(() => {
        validateMaxDistance();
    }, [tempFilters.maxDistance]);

    const handleOpenNowChange = (e) => {
        setTempFilters({ ...tempFilters, openNow: e.target.checked });
    };

    const handleNearbyChange = (e) => {
        // if (props.address.text == '') {
        //     e.preventDefault(); // Prevent the toggle action
        //     setShowModal(true); // Show the modal
        // } else {
            setTempFilters({ ...tempFilters, nearby: e.target.checked });
        //}
    };

    const handleFadeClick = (index) => {
        setFadeStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = false;
            return newStates;
        });

        setTimeout(() => {
            // Remove the ingredient from the array after the fade-out animation
            setFiltersToApply((prevFilters) => {
                const newAllergens = [...prevFilters.allergens];
                newAllergens.splice(index, 1);
                return { ...prevFilters, allergens: newAllergens };
            });

            // Update the fadeStates array after removing the ingredient
            setFadeStates((prevStates) => {
                const newStates = [...prevStates];
                newStates.splice(index, 1);
                return newStates;
            });
        }, 300);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if the necessary conditions for the address and maxDistance are not met
        if ((tempFilters.nearby || tempFilters.maxDistance !== '') && props.address.text === '') {
            e.preventDefault(); // Prevent default form submission behavior
            setShowModal(true); // Show the modal
            return; // Stop further execution
        }
    
        // Check for any errors
        if (errorMaxDistance !== "") {
            console.log("Error present, not submitting:", errorMaxDistance);
            e.preventDefault(); // Prevent default form submission if there is an error
            return; // Stop further execution
        }
    
        // If all conditions are met and no errors are present
        setFiltersToApply(tempFilters);
        //console.log("Filters applied:", tempFilters);
        navigate(`/`); // Navigate to the new page after setting filters
    };

    const sortByField = (field) => {

        setTempFilters((prevFilter) => ({
            ...prevFilter,
            label:capitalizeFirstLetter(field)
        }));
        //console.log(filtersToApply);

      };
    
      const toggleOrder = () => {
        setTempFilters((prevFilter) => ({
            ...prevFilter,
            order: tempFilters.order === 'ASC' ? 'DESC' : 'ASC'
        }));
      };
    return (
        <>
            <Container fluid style={{ height: '78vh', overflowY: 'auto', marginBottom: '10%' }}>
                <Row>
                    <Col>
                        <h2 style={{ marginTop: "3%", fontWeight: "bold"}}>Filter by:</h2>
                        <ToggleButton
                            id="toggle-check1"
                            type="checkbox"
                            variant="outline-primary"
                            checked={tempFilters.openNow}
                            value="1"
                            onChange={(e) => handleOpenNowChange(e)}
                            style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", borderRadius: 0, marginTop: "1.8%", marginBottom: "2.8%" }}
                        >
                            {tempFilters.openNow ? <FontAwesomeIcon icon="fa-solid fa-check" /> : ''} Open Now
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-check2"
                            type="checkbox"
                            variant="outline-primary"
                            checked={tempFilters.nearby && !locationError}
                            value="1"
                            onChange={handleNearbyChange}
                            disabled={locationError}
                            style={{ marginLeft: "1.5rem", paddingLeft: "2rem", paddingRight: "2rem", borderRadius: 0, marginTop: "1.8%", marginBottom: "2.8%" }}
                        >
                            <PositionModal show={showModal} setShow={setShowModal} action={handleLocationClick} />
                            <PositionModalAlert text={props.address.text} show={showModal2} setShow={setShowModal2} />
                            {isLoadingLocation ? (
                                <FontAwesomeIcon icon="fas fa-spinner" spin style={{"marginRight": 10}} />
                            ) : (
                                tempFilters.nearby && !locationError ? <FontAwesomeIcon icon="fa-solid fa-check" style={{"marginRight": 10}}/> : ''
                            )}
                            Nearby
                        </ToggleButton>
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row>
                                <Col md={3} style={{ marginTop: "2.5%", marginBottom: "3.5%" }}>
                                    <Form.Group controlId="formBasicCategory" style={{ fontSize: "1rem" }}>
                                        <Form.Label>Category</Form.Label>
                                        <Select
                                            closeMenuOnSelect={false}
                                            placeholder="Choose Category"
                                            components={animatedComponents}
                                            isMulti
                                            isSearchable={false}
                                            isClearable={true}
                                            options={props.categoriesOptions}
                                            value={props.categoriesOptions.filter((option) => tempFilters.categories.includes(option.value))}
                                            onChange={handleCategoryChange}
                                            onMenuOpen={() => setMenuOpen(true)}
                                            onMenuClose={() => setMenuOpen(false)}
                                            menuIsOpen={menuOpen}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3} style={{ marginTop: "1.8%", marginBottom: "2.8%" }}>
                                    <Form.Group className='mb-3' controlId="formBasicIngredient">
                                        <Form.Label>Allergens to avoid</Form.Label>
                                        <Row>
                                            <Col>
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    placeholder="Choose Allergens"
                                                    components={animatedComponents}
                                                    isMulti
                                                    isSearchable={true}
                                                    isClearable={true}
                                                    options={props.allergensOptions}
                                                    value={props.allergensOptions.filter((option) => tempFilters.allergens.includes(option.value))}
                                                    onChange={handleIngredientChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} style={{ marginTop: "-0.4rem", marginBottom: "2.8%" }}>
                                    <Row>
                                        <Form.Group as={Col} controlId="formBasicQualityRating">
                                            <Form.Label>Quality Rating</Form.Label>
                                            <Form.Select
                                                name="qualityRating"  // This should match the key in your state
                                                onChange={(e) => handleChange({ target: { name: 'qualityRating', value: e.target.value } })}
                                                value={tempFilters.qualityRating}  // Set the value from state
                                            >
                                                <option value="">Choose...</option>
                                                <option value="5">5 Stars</option>
                                                <option value="4">4 Stars & above</option>
                                                <option value="3">3 Stars & above</option>
                                                <option value="2">2 Stars & above</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formBasicSafetyRating">
                                            <Form.Label>Safety Rating</Form.Label>
                                            <Form.Select
                                                name="safetyRating"  // This should match the key in your state
                                                onChange={(e) => handleChange({ target: { name: 'safetyRating', value: e.target.value } })}
                                                value={tempFilters.safetyRating}  // Set the value from state
                                            >
                                                <option value="">Choose...</option>
                                                <option value="5">5</option>
                                                <option value="4">4 & above</option>
                                                <option value="3">3 & above</option>
                                                <option value="2">2 & above</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Row>
                                </Col>
                                <Col md={3} style={{ marginTop: "1.8%", marginBottom: "2.8%" }}>
                                {isLoadingLocation ? <Form.Group controlId="formMaxDistance">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {isLoadingLocation && (
                                                <FontAwesomeIcon icon="fas fa-spinner" spin style={{"marginRight": 10}} />
                                            )}
                                            <Form.Control
                                                type="number"
                                                name="maxDistance"
                                                placeholder="Max Distance (km)"
                                                value={tempFilters.maxDistance}
                                                onChange={handleChange}
                                                isInvalid={!!errorMaxDistance}
                                                disabled={locationError}
                                            />
                                        </div>
                                        <Form.Control.Feedback type="invalid">
                                            {errorMaxDistance}
                                        </Form.Control.Feedback>
                                    </Form.Group> : 
                                    <Form.Group controlId="formMaxDistance">
                                        <Form.Control
                                            type="number"
                                            name="maxDistance"
                                            placeholder="Max Distance (km)"
                                            value={tempFilters.maxDistance}
                                            onChange={handleChange}
                                            disabled={locationError}
                                            isInvalid={!!errorMaxDistance}
                                        />
                                    <Form.Control.Feedback type="invalid">
                                        {errorMaxDistance}
                                    </Form.Control.Feedback>
                                    </Form.Group>}
                                </Col>
                                <Col xs={12} style={{ marginTop: "1.8%", marginBottom: "2.8%" }}>
                                    <Form.Label>Price Range: </Form.Label><>{tempFilters.priceRange[0] == 100 && tempFilters.priceRange[1] == 110 ? <span style={{ marginLeft: "1rem" }}>100€+</span> : tempFilters.priceRange[1] == 110 ? <span style={{ marginLeft: "1rem" }}>{tempFilters.priceRange[0] == 0 ? (tempFilters.priceRange[0] + 1) : tempFilters.priceRange[0]}€ - {tempFilters.priceRange[1] - 10}€+</span> : <span style={{ marginLeft: "1rem" }}>{tempFilters.priceRange[0] == 0 ? (tempFilters.priceRange[0] + 1) : tempFilters.priceRange[0]}€ - {tempFilters.priceRange[1]}€</span>}</>
                                    <div style={{ margin: '1em' }}>
                                        <Range
                                            step={10}
                                            min={0}
                                            max={110}
                                            values={tempFilters.priceRange}
                                            onChange={(values) => {
                                                let [minValue, maxValue] = values;

                                                // If trying to set the gap less than 10, prevent the change
                                                if (maxValue - minValue < 10) {
                                                    return;
                                                }

                                                setTempFilters({ ...tempFilters, priceRange: [minValue, maxValue] });
                                            }}

                                            renderTrack={({ props, children, isDragged }) => {
                                                const percentageStart = (tempFilters.priceRange[0] - 0) / (110 - 0) * 100; // Assuming min is 0 and max is 110
                                                const percentageEnd = (tempFilters.priceRange[1] - 0) / (110 - 0) * 100;

                                                return (
                                                    <div
                                                        {...props}
                                                        style={{
                                                            ...props.style,
                                                            height: '2.5px',
                                                            width: '100%',
                                                            background: `linear-gradient(to right, lightblue ${percentageStart}%, blue ${percentageStart}%, blue ${percentageEnd}%, lightblue ${percentageEnd}%)`
                                                        }}
                                                    >
                                                        {children}
                                                    </div>
                                                );
                                            }}

                                            renderThumb={({ props }) => (
                                                <div
                                                    {...props}
                                                    style={{
                                                        ...props.style,
                                                        height: '13px',
                                                        width: '13px',
                                                        borderRadius: '100%',
                                                        backgroundColor: '#0d6efd'
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                                {/* <Col md={3} style={{marginTop: "3%", marginBottom: "4%"}}>
                                    <Form.Group controlId="formBasicPriceRating">
                                        <Form.Label>Price Rating</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="priceRating"
                                            value={tempFilters.priceRating}
                                            onChange={handleChange}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="4">4 Stars & above</option>
                                            <option value="3">3 Stars & above</option>
                                            <option value="2">2 Stars & above</option>
                                        </Form.Control>
                                    </Form.Group> 
                                </Col> */}
                            </Row>
                            <Row>
                                <Form.Label>Sort By:</Form.Label>
        <Col xs={8} >
          <DropdownButton id="dropdown" title={tempFilters.label} variant="light" >
            <Dropdown.Item onClick={() => sortByField("Nothing")}>Nothing</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("Reviews' average price")}>Reviews' average price</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("Reviews' average quality")}>Reviews' average quality</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("Reviews' average safety")}>Reviews' average safety</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col onClick={toggleOrder} >
          {tempFilters.order === 'ASC' && tempFilters.label != 'Nothing' ? (
            <><i className="bi bi-sort-up" style={{ fontSize: "1.5rem" }}></i><span>{ tempFilters.order}</span></>
          ) : tempFilters.label == 'Nothing' ? "" : (
            <><i className="bi bi-sort-down"  style={{ fontSize: "1.5rem" }}></i><span>{ tempFilters.order}</span></>
          )}
        </Col>
                            </Row>
                            <Col style={{
                                position: "fixed",  // Fixed position
                                bottom: "2.4%",       // 5% from the bottom of the viewport
                                left: "50%",        // Initially, put it halfway across the screen
                                transform: "translateX(-50%)",  // Adjust horizontally to truly center it
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "85%",
                            }}>
                                <Button disabled={
                                    (tempFilters.categories.length === 0) &&
                                    (tempFilters.priceRange[0] === 0 && tempFilters.priceRange[1] === 110) &&
                                    (tempFilters.maxDistance === '') &&
                                    (tempFilters.qualityRating === '') &&
                                    (tempFilters.safetyRating === '') &&
                                    (tempFilters.allergens.length === 0) && // Added check for allergens
                                    (tempFilters.openNow === false) &&
                                    (tempFilters.nearby === false) &&
                                    (tempFilters.label === "Nothing") &&
                                    (tempFilters.order === "DESC" || tempFilters.order === "ASC")
                                }    
                                variant="danger" onClick = {() => handleRemoveFilters()}>
                                    Remove filters
                                </Button>
                                <Button variant="primary" type='submit'
                                    disabled={!!errorMaxDistance || isLoadingLocation}>
                                    Apply filters
                                </Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>

            </Container>
        </>
    );
};

export { FilterPage };
