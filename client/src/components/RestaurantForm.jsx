import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from './Home';
import { Button, Container, Form, ListGroup, Placeholder } from 'react-bootstrap';
import { PLACEHOLDER } from './Costants';
import { TimePicker } from '@hilla/react-components/TimePicker.js';
import dayjs from 'dayjs';
import validator from 'validator';
import API from '../API';
import 'react-phone-number-input/style.css'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import { StandaloneSearchBox, LoadScript } from '@react-google-maps/api';
const libraries = ['places']; // Define libraries outside the component (for address field)
import { API_KEY } from './Costants';

const handleImageChange = (event, setImage, setFileName) => {
    const file = event.target.files[0];
    setFileName(file.name);
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

function ProgressLabel(props) {
    const { progress } = props;

    let text;
    switch (progress) {
        case 1:
            text = 'Insert Info ';
            break;
        case 2:
            text = 'Describe Your Activity ';
            break;
        case 3:
            text = 'Describe Your Menù ';
            break;
        default:
            text = 'No matching case found';
            break;
    }

    return (
        <h1 className="text-center">{text}({props.progress}/3)</h1>
    );
}

function InnerForm(props) {
    const navigate = useNavigate();
    const restaurant_id = useParams().id;
    const { progress, setProgress } = props;
    // states for progress 1/3
    const [activityName, setActivityName] = useState({ text: '', invalid: false });
    const [address, setAddress] = useState({ text: '', lat: 0.0, lng: 0.0, invalid: false });
    const [phone, setPhone] = useState({ text: '', invalid: false });
    const [description, setDescription] = useState({ text: '', invalid: false });
    const [website, setWebsite] = useState({ link: '', invalid: false });
    const [instagram, setInstagram] = useState({ link: '', invalid: false });
    const [facebook, setFacebook] = useState({ link: '', invalid: false });
    const [twitter, setTwitter] = useState({ link: '', invalid: false });
    const [times, setTimes] = useState([{ id: 1, first: '', last: '', invalid: false }]);
    // temporary client id for managing the time intervals (find the max id in the times array and add 1)
    const [timetempId, setTimeTempId] = useState(times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1);

    // states for progress 2/3
    const [image, setImage] = useState(PLACEHOLDER);
    const [fileName, setFileName] = useState('No File Chosen');

    // states for progress 3/3
    const [dishes, setDishes] = useState([{ "id": 1, "name": "Pasta Carbonara", "price": 10.99, "type": "pasta", "image": "http://localhost:3001/dishes/bismark.jpeg", "ingredients": [{ "id": 1, "dishId": 1, "image": "http://localhost:3001/ingredients/spaghetti.png", "name": "Spaghetti", "allergens": "gluten", "brandName": "Barilla", "brandLink": "http://www.barilla.com" }, { "id": 2, "dishId": 1, "image": "http://localhost:3001/ingredients/bacon.jpg", "name": "Bacon", "allergens": "pork", "brandName": "HomeMade", "brandLink": null }] }, { "id": 2, "name": "Margherita Pizza", "price": 12.99, "type": "pizza", "image": "http://localhost:3001/dishes/capricciosa.jpg", "ingredients": [{ "id": 3, "dishId": 2, "image": "http://localhost:3001/ingredients/tomato_sauce-png", "name": "Tomato Sauce", "allergens": null, "brandName": "Ragu", "brandLink": "http://www.ragu.com" }, { "id": 4, "dishId": 2, "image": "http://localhost:3001/ingredients/mozzarella.jpg", "name": "Mozzarella Cheese", "allergens": "lactose", "brandName": "Galbani", "brandLink": "http://www.galbani.com" }] }]);
    //const [dishes,setDishes] = useState([]);

    // temporary client id for managing the dishes inserted (find the max id in the dishes array and add 1)
    const [dishtempId, setDishTempId] = useState(dishes.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1);

    // to retrieve info of the restaurant if in edit
    useEffect(() => {
        // function used to retrieve restaurant information in detail
        async function getRestaurant(restaurantId) {
            try {
                const restaurant = await API.getRestaurant(restaurantId);
                // set info of the restaurant
                setActivityName({ text: restaurant.name, invalid: false });
                const address_string_to_object = (addr) => {
                    const main_infos = addr.split(';');
                    const lat = parseFloat(main_infos[1].split(':')[1]);
                    const lng = parseFloat(main_infos[2].split(':')[1]);
                    return {
                        text: main_infos[0],
                        lat: lat,
                        lng: lng
                    };
                }
                setAddress(address_string_to_object(restaurant.location));
                setPhone({ text: restaurant.phone, invalid: false });
                setDescription({ text: restaurant.description, invalid: false });
                setWebsite({ link: restaurant.website, invalid: false });
                setInstagram({ link: restaurant.instagram, invalid: false });
                setFacebook({ link: restaurant.facebook, invalid: false });
                setTwitter({ link: restaurant.twitter, invalid: false });
                // retrieve hours (remove the first empty element, then inserting from the db)
                setTimes([]);
                restaurant.hours.split(';').forEach((timeRange) => {
                    // Split each time range by hyphen to get start and end times
                    const [startTime, endTime] = timeRange.split('-');

                    // Check if the time already exists in the state
                    const timeExists = times.some(time => time.first === startTime && time.last === endTime);

                    if (!timeExists) {
                        addTime({ first: startTime, last: endTime, invalid: false });
                    }
                });
                setImage(restaurant.image);
                //setDishes(restaurant.dishes);
            } catch (err) {
                // show error message
                console.log(err);
            }
        };
        if (restaurant_id) {
            getRestaurant(restaurant_id);
        }
    }, []);

    function addDish(new_dish) {
        setDishes((oldDishList) => [...oldDishList, Object.assign({}, { id: dishtempId, new_dish })]);
        setDishTempId((oldTempId) => oldTempId + 1);
    }

    function editDish(updated_dish) {
        setDishes((dishes) => dishes.map((dish) => {
            if (dish.id === updated_dish.id) {
                return Object.assign({}, updated_dish);
            } else {
                return dish;
            }
        }
        ));
    }

    function deleteDish(dishId) {
        setDishes((old_dishes) => old_dishes.filter((dish) => {
            if (dish.id !== dishId) {
                return true;
            } else {
                return false;
            }
        }
        ));
    }

    function addTime(new_time) {
        setTimeTempId((oldTempId) => {
            if (new_time) {
                setTimes((oldtimeList) => {
                    // Check if the time already exists
                    const timeExists = oldtimeList.some(time => time.first === new_time.first && time.last === new_time.last);
                    if (!timeExists) {
                        return [...oldtimeList, { id: oldTempId, ...new_time }]
                    }
                    return oldtimeList;
                });
            } else {
                setTimes((oldtimeList) => [
                    ...oldtimeList,
                    { id: oldTempId, first: '', last: '', invalid: false },
                ]);
            }
            return oldTempId + 1; // Return the updated ID
        });
    }

    function saveTime(updatedTime) {
        setTimes((timeList) => timeList.map((time) => {
            if (time.id === updatedTime.id) {
                return Object.assign({}, updatedTime);
            } else {
                return time;
            }
        }
        ));
    }

    function deleteTime(timeId) {
        setTimes((timeList) => timeList.filter((time) => {
            if (timeList.length > 1) {
                if (time.id !== timeId) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        }
        ));
    }

    function checkTime(time) {
        if (time.first && time.last) {
            const first_hour = dayjs(`2023-01-01T${time.first}`);
            const last_hour = dayjs(`2023-01-01T${time.last}`);
            if (last_hour <= first_hour) {
                saveTime(Object.assign({}, time, { invalid: true }));
            } else {
                saveTime(Object.assign({}, time, { invalid: false }));
            }
        }
    }

    function mainInfoValidation(info, setState) {
        let invalid = undefined;
        if (info.text.length === 0) {
            invalid = true;
            setState({ text: info.text, invalid: true });
        } else {
            setState({ text: info.text, invalid: false });
        }
        return invalid;
    }

    function phoneValidation(phone, setPhone) {
        let invalid = undefined;
        try {
            const phoneNumber = parsePhoneNumber(phone.text);
            if (!phoneNumber || !phoneNumber.isValid()) {
                invalid = true;
                setPhone({ text: phone.text, invalid: true });
            } else {
                setPhone({ text: phone.text, invalid: false });
            }
        } catch (error) {
            // Handle parsing errors if needed
            invalid = true;
            setPhone({ text: phone.text, invalid: true });
        }
        return invalid;
    }

    function addressValidation(address, setAddress) {
        return new Promise((resolve, reject) => {
            // Create a Geocoder instance
            const geocoder = new google.maps.Geocoder();
    
            // Define the Geocoding request
            const geocodeRequest = {
                address: address.text,
            };
    
            // Perform Geocoding
            geocoder.geocode(geocodeRequest, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                    // Address is valid
                    setAddress({ text: address.text, lat: address.lat, lng:address.lng, invalid: false });
                    resolve(undefined); // Resolve with undefined for a valid address
                } else {
                    // Address is invalid
                    setAddress({ text: address.text, lat:address.lat, lng:address.lng, invalid: true });
                    reject(true); // Resolve with true for an invalid address
                }
            });
        });
    }    

    function linkValidation(info, setState) {
        let invalid = undefined;
        if ((info.link.length !== 0 && !validator.isURL(info.link))) {
            invalid = true;
            setState({ link: info.link, invalid: true });
        } else {
            setState({ link: info.link, invalid: false });
        }
        return invalid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        let invalid = false;
        switch (progress) {
            case 1:
                // validate activitys name address phone description
                let activity_invalidity = mainInfoValidation(activityName, setActivityName);
                if (activity_invalidity) {
                    invalid = activity_invalidity;
                }
                try {
                    // Wait for the promise to settle before moving to the next line
                    await addressValidation(address, setAddress);
                    invalid = undefined;
                } catch (error) {
                    invalid = true;
                }            
                let phone_invalidity = phoneValidation(phone, setPhone);
                if (phone_invalidity) {
                    invalid = phone_invalidity;
                }
                let description_invalidity = mainInfoValidation(description, setDescription);
                if (description_invalidity) {
                    invalid = description_invalidity;
                }
                // links validation
                let website_invalidity = linkValidation(website, setWebsite);
                if (website_invalidity) {
                    invalid = website_invalidity;
                }
                let instagram_invalidity = linkValidation(instagram, setInstagram);
                if (instagram_invalidity) {
                    invalid = instagram_invalidity;
                }
                let facebook_invalidity = linkValidation(facebook, setFacebook);
                if (facebook_invalidity) {
                    invalid = facebook_invalidity;
                }
                let twitter_invalidity = linkValidation(twitter, setTwitter);
                if (twitter_invalidity) {
                    invalid = twitter_invalidity;
                }
                // timetable validation
                // required part (1 required timetable has to contain values)
                if (times.length === 1 && (times[0] === '' || times[1] === '')) {
                    invalid = true;
                    saveTime(Object.assign({}, times[0], { invalid: true }));
                } else {
                    saveTime(Object.assign({}, times[0], { invalid: false }));
                }
                // if present, check valid time intervals
                for (const time of times) {
                    const first_hour = dayjs(`2023-01-01T${time.first}`);
                    const last_hour = dayjs(`2023-01-01T${time.last}`);
                    if (last_hour <= first_hour) {
                        invalid = true;
                        saveTime(Object.assign({}, time, { invalid: true }));
                    } else {
                        saveTime(Object.assign({}, time, { invalid: false }));
                    }
                }
                break;
            case 2:
                // no validation needed
                break;
            case 3:
                // no validation needed (rely on addDish and editDish screens to validate)
                break;
            default:
                break;
        }
        
        // go on if all ok
        if (progress < 3) {
            if (!invalid) {
                setProgress(progress + 1);
            }
        } else {
            //progress is 3 and click save button, construct the http post object and submit by invoking the API
            // construct the object to call the API
            const restaurant = {};
            restaurant.image = image;
            restaurant.name = activityName.text;
            const address_object_to_string = (addr) => {
                return addr.text + ';lat:' + addr.lat + ";lng:" + addr.lng;
            }
            restaurant.location = address_object_to_string(address);
            restaurant.phone = phone.text;
            restaurant.website = website.link;
            restaurant.facebook = facebook.link;
            restaurant.instagram = instagram.link;
            restaurant.twitter = twitter.link;
            restaurant.hours = times.map(time => `${time.first}-${time.last}`).join(';');
            restaurant.description = description.text;
            restaurant.dishes = dishes;

            if (restaurant_id) {
                // update case, add the restaurantId and 
                restaurant.id = restaurant_id;
                console.log(restaurant);
                // call the API to update an existing restaurant
                await API.editRestaurant(restaurant);
            } else {
                console.log(restaurant);
                // call the API to add a new restaurant
                await API.createRestaurant(restaurant);
            }
            //then return home
            navigate('/');
        }
    };

    let componentToRender;
    switch (progress) {
        case 1:
            componentToRender = (
                <Container fluid>
                    <Form.Group className="mb-3" >
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Main Info's</Form.Label>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={activityName.invalid} type="text" placeholder="Enter The Activity's Name" onChange={(event) => mainInfoValidation({ text: event.target.value, invalid: activityName.invalid }, setActivityName)} defaultValue={activityName.text} />
                            <Form.Control.Feedback type="invalid">Please Insert The Activity's Name</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <AddressSelector address={address} setAddress={setAddress} />
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <PhoneInput className={(phone.invalid === false) ? 'custom-input' : 'custom-input is-invalid'} defaultCountry='IT' placeholder="Enter The Phone Number" value={phone.text} onChange={(event) => { phoneValidation({ text: event, invalid: phone.invalid }, setPhone) }} />
                            <p style={{ color: '#dc3545' }} className='small'>{(phone.invalid === true) ? 'Please Insert a Valid Phone Number' : ''}</p>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={description.invalid} as="textarea" rows={4} placeholder="Enter The Description" onChange={(event) => mainInfoValidation({ text: event.target.value, invalid: description.invalid }, setDescription)} defaultValue={description.text} />
                            <Form.Control.Feedback type="invalid">Please Insert A Description</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Website/Social</Form.Label>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={website.invalid} type="text" placeholder="Enter The Website Link" onChange={(event) => { linkValidation({ link: event.target.value, invalid: website.invalid }, setWebsite) }} defaultValue={website.link} />
                            <Form.Control.Feedback type="invalid">Please Insert A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={instagram.invalid} type="text" placeholder="Enter The Instagram Link" onChange={(event) => linkValidation({ link: event.target.value, invalid: instagram.invalid }, setInstagram)} defaultValue={instagram.link} />
                            <Form.Control.Feedback type="invalid">Please Insert A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={facebook.invalid} type="text" placeholder="Enter The Facebook Link" onChange={(event) => linkValidation({ link: event.target.value, invalid: facebook.invalid }, setFacebook)} defaultValue={facebook.link} />
                            <Form.Control.Feedback type="invalid">Please Insert A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={twitter.invalid} type="text" placeholder="Enter The Twitter Link" onChange={(event) => linkValidation({ link: event.target.value, invalid: twitter.invalid }, setTwitter)} defaultValue={twitter.link} />
                            <Form.Control.Feedback type="invalid">Please Insert A Valid Link</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>TimeTable</Form.Label>
                        {times.map((time, index) => {
                            return <TimeSelector key={index} n_times={times.length} time={time} addTime={addTime} saveTime={saveTime} deleteTime={deleteTime} checkTime={checkTime} />;
                        })}
                    </Form.Group>

                </Container>
            );
            break;
        case 2:
            componentToRender = (
                <Container fluid>
                    <Form.Group className="mb-3" >
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Activity Image</Form.Label>
                        <ImageViewer width={"300px"} height={"300px"} image={image} setImage={setImage} fileName={fileName} setFileName={setFileName} />
                    </Form.Group>
                </Container>
            );
            break;
        case 3:
            componentToRender = (
                <>
                    <Container>
                        <ListGroup>
                            {
                                dishes.map((dish, index) => {
                                    return (<DishItem key={index} dish={dish} deleteDish={deleteDish} />);
                                })
                            }
                        </ListGroup>
                    </Container>
                    <Container className="d-flex flex-column align-items-center width-100">
                        <Button variant='primary' onClick={() => { navigate('/addDish') }}>Add Dish</Button>
                    </Container>
                </>
            );
            break;
        default:
            componentToRender = <p>No matching case found</p>;
    }

    return (
        <>
            <Form noValidate onSubmit={handleSubmit}>
                <Container fluid style={{ height: '78vh', overflowY: 'auto' }}>
                    {componentToRender}
                </Container>
                <Container className="d-flex justify-content-between mt-auto">
                    {(progress > 1) ? <Button variant="warning" onClick={() => { setProgress(progress - 1) }}>Back</Button> : ''}
                    {(progress < 3) ? <Button variant="primary" type='submit' className="ms-auto">Next</Button> : ''}
                    {(progress === 3 && dishes.length !== 0) ? <Button variant="primary" type='submit' className="ms-auto">Save</Button> : ''}
                </Container>
            </Form>
        </>
    );
}

/**
 * React state to use and pass to this component as props:
 * const [image, setImage] = useState(PLACEHOLDER);
 * const [fileName, setFileName] = useState('No File Chosen');
 * PLACEHOLDER is a costant declared in Costants.jsx to import 
 */
function ImageViewer(props) {
    const { width, height, image, setImage, fileName, setFileName } = props;
    const fileInputRef = useRef(null);
    return (
        <>
            <Container className="d-flex flex-column align-items-center">
                <img height={height} width={width} style={{ marginBottom: '5%' }} src={image} />
                {(image !== PLACEHOLDER) ? <Button variant='danger' style={{ marginBottom: '5%' }} onClick={() => { setImage(PLACEHOLDER); setFileName('No File Chosen'); }}>Remove Activity Image</Button> : ''}
            </Container>
            <Container className="d-flex align-items-center">
                <Button variant='light' onClick={() => { fileInputRef.current.click() }}>Choose File</Button><span style={{ marginLeft: '5%' }}>{fileName}</span>
                <Form.Control style={{ display: 'none' }} type='file' ref={fileInputRef} onChange={(event) => handleImageChange(event, setImage, setFileName)} accept="image/*" />
            </Container>
        </>
    );
}

function TimeSelector(props) {
    const { n_times, time, addTime, saveTime, deleteTime, checkTime } = props;

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5%', flexWrap: 'wrap' }}>
            <TimePicker invalid={time.invalid} style={{ width: "30%", marginRight: "2%" }} value={time.first} step={60 * 30} onChange={(event) => {
                const new_time = { id: time.id, first: event.target.value, last: time.last, invalid: time.invalid };
                saveTime(new_time);
                checkTime(new_time);
            }} onKeyDown={(event) => { event.preventDefault() }} />
            <TimePicker invalid={time.invalid} style={{ width: "30%", marginRight: "5%" }} value={time.last} step={60 * 30} onChange={(event) => {
                const new_time = { id: time.id, first: time.first, last: event.target.value, invalid: time.invalid };
                saveTime(new_time);
                checkTime(new_time);
            }} onKeyDown={(event) => { event.preventDefault() }} />
            <Button size='sm' variant="success" onClick={() => { addTime() }} style={{ marginRight: "2%" }}><i className="bi bi-plus-lg"></i></Button>
            {(n_times > 1) ? <Button size='sm' variant="danger" onClick={() => { deleteTime(time.id) }}><i className="bi bi-trash"></i></Button> : ''}
            <p style={{ display: 'block', color: '#dc3545' }} className='small'>{(time.invalid === true) ? 'Choose a valid time interval' : ''}</p>
        </div>
    );
}

function DishItem(props) {
    const { dish, deleteDish } = props;
    const navigate = useNavigate();

    return (
        //border-0 to remove the border
        <div className="d-flex justify-content-center align-items-center" style={{ marginBottom: '5%' }}>
            <ListGroup.Item className="border-0" style={{ marginRight: '7%' }}>{dish.name}</ListGroup.Item>
            <Button size='sm' variant="success" onClick={() => { navigate(`/editDish/${dish.id}`) }} style={{ marginRight: "5%" }}><i className="bi bi-pencil-square"></i></Button>
            <Button size='sm' variant="danger" onClick={() => { deleteDish(dish.id) }}><i className="bi bi-trash"></i></Button>
        </div>
    );
}

/**
 * React state to use and pass to this component as props:
 * const [address, setAddress] = useState({ text: '', lat: 0.0, lng: 0.0, invalid: false });
 */
function AddressSelector(props) {
    const { address, setAddress } = props;
    const inputRef = useRef();

    const handlePlaceChanged = () => {
        const [place] = inputRef.current.getPlaces();
        if (place) {
            setAddress({
                text: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                invalid: address.invalid
            });
        }
    };

    return (
        <StandaloneSearchBox onLoad={(ref) => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
            <>
                <Form.Control
                    isInvalid={address.invalid}
                    type="text"
                    placeholder="Enter The Location"
                    // HERE NOT TO AVOID CALL TOO MUCH THE API onChange={(event) => addressValidation({text: event.target.value, lat:address.lat, lng:address.lng, invalid: address.invalid},setAddress)}
                    onChange={(event) => { setAddress({ text: event.target.value, lat:address.lat, lng:address.lng, invalid: address.invalid }); }}
                    defaultValue={address.text}
                />
                <Form.Control.Feedback type="invalid">Please Insert a Valid Address</Form.Control.Feedback>
            </>
        </StandaloneSearchBox>
    );
}

function RestaurantForm(props) {
    const [progress, setProgress] = useState(1);

    return (
        <>
            <TopBar />
            <ProgressLabel progress={progress} />
            <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
                <InnerForm progress={progress} setProgress={setProgress} />
            </LoadScript>
        </>
    );
}
export { RestaurantForm, ImageViewer, AddressSelector };
