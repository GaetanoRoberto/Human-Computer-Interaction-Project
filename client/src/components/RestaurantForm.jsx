import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Home';
import { Button, Container, Form, ListGroup, Col, Row, Dropdown } from 'react-bootstrap';
import { PLACEHOLDER } from './Costants';
import dayjs from 'dayjs';
import validator from 'validator';
import API from '../API';
import 'react-phone-number-input/style.css'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import { ImageViewer, DishItem, EditTimeSelector, AddressSelector, address_string_to_object, address_object_to_string, ViewTimeSelector, ViewDailyTimeSelector, time_string_to_object, time_object_to_string, filter_by_day, sort_and_merge_times } from './RestaurantFormUtility';
import { ErrorContext } from './userContext';

function ProgressLabel(props) {
    const { progress } = props;

    let text;
    switch (progress) {
        case 1:
            text = 'Insert Info ';
            break;
        case 2:
            text = 'Insert your TimeTable ';
            break;
        case 3:
            text = 'Describe Your Activity '
            break;
        case 4:
            text = 'Describe Your Menù ';
            break;
        default:
            text = 'No matching case found';
            break;
    }

    return (
        <h1 className="text-center">{text}({props.progress}/4)</h1>
    );
}

function InnerForm(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const handleError = useContext(ErrorContext);
    const restaurant_id = useParams().id;
    const { progress, setProgress } = props;
    // states for progress 1/4
    const [activityName, setActivityName] = useState({ text: '', invalid: false });
    const [address, setAddress] = useState({ text: '', lat: 0.0, lng: 0.0, invalid: false });
    const [phone, setPhone] = useState({ text: '', invalid: false });
    const [description, setDescription] = useState({ text: '', invalid: false });
    const [website, setWebsite] = useState({ link: '', invalid: false });
    const [instagram, setInstagram] = useState({ link: '', invalid: false });
    const [facebook, setFacebook] = useState({ link: '', invalid: false });
    const [twitter, setTwitter] = useState({ link: '', invalid: false });

    // states for progress 2/4
    const [times, setTimes] = useState([]);
    const [day,setDay] = useState({text:'', clicked: false});
    const [temporaryTimes,setTemporaryTimes] = useState([{id: times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1, day: '', first: '', last: '', invalid: false}]);
    const [errorMsg,setErrorMsg] = useState('');
    // temporary client id for managing the time intervals (find the max id in the times array and add 1)
    const [timetempId, setTimeTempId] = useState(times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 2);
    const prevTimesLength = useRef(times.length);

    // states for progress 3/4
    const [image, setImage] = useState(PLACEHOLDER);
    const [fileName, setFileName] = useState('No File Chosen');

    // states for progress 4/4
    //const [dishes, setDishes] = useState([{ "id": 1, "name": "Pasta Carbonara", "price": 10.99, "type": "pasta", "image": "http://localhost:3001/dishes/bismark.jpeg", "ingredients": [{ "id": 1, "dishId": 1, "image": "http://localhost:3001/ingredients/spaghetti.png", "name": "Spaghetti", "allergens": "gluten", "brandName": "Barilla", "brandLink": "http://www.barilla.com" }, { "id": 2, "dishId": 1, "image": "http://localhost:3001/ingredients/bacon.jpg", "name": "Bacon", "allergens": "pork", "brandName": "HomeMade", "brandLink": null }] }, { "id": 2, "name": "Margherita Pizza", "price": 12.99, "type": "pizza", "image": "http://localhost:3001/dishes/capricciosa.jpg", "ingredients": [{ "id": 3, "dishId": 2, "image": "http://localhost:3001/ingredients/tomato_sauce-png", "name": "Tomato Sauce", "allergens": null, "brandName": "Ragu", "brandLink": "http://www.ragu.com" }, { "id": 4, "dishId": 2, "image": "http://localhost:3001/ingredients/mozzarella.jpg", "name": "Mozzarella Cheese", "allergens": "lactose", "brandName": "Galbani", "brandLink": "http://www.galbani.com" }] }]);
    const [dishes, setDishes] = useState([]);

    // temporary client id for managing the dishes inserted (find the max id in the dishes array and add 1)
    const [dishtempId, setDishTempId] = useState(dishes.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1);

    // TO ENSURE CORRECT TEMPORARY ID OF THE TIMES UPDATE
    useEffect(() => {
        // Check if the length of times array has changed
        if (times.length !== prevTimesLength.current) {
            // Update temporaryTimes and timetempId when times state changes
            setTemporaryTimes([
                {
                    id: times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1,
                    day: '',
                    first: '',
                    last: '',
                    invalid: false,
                },
            ]);
            setTimeTempId(
                times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 2
            );
            // Update the length
            prevTimesLength.current = times.length;
        }
    }, [times]);

    // to retrieve info of the restaurant if in edit
    useEffect(() => {
        // function used to retrieve restaurant information in detail
        async function getRestaurant(restaurantId) {
            try {
                const restaurant = await API.getRestaurant(restaurantId);
                // set info of the restaurant
                setActivityName({ text: restaurant.name, invalid: false });
                setAddress(address_string_to_object(restaurant.location));
                setPhone({ text: restaurant.phone, invalid: false });
                setDescription({ text: restaurant.description, invalid: false });
                setWebsite({ link: restaurant.website, invalid: false });
                setInstagram({ link: restaurant.instagram, invalid: false });
                setFacebook({ link: restaurant.facebook, invalid: false });
                setTwitter({ link: restaurant.twitter, invalid: false });
                // retrieve hours
                setTimes(sort_and_merge_times(time_string_to_object(restaurant.hours)));
                setImage(restaurant.image);
                setDishes(restaurant.dishes);
            } catch (err) {
                // show error message
                handleError(err);
            }
        };
        if (restaurant_id) {
            getRestaurant(restaurant_id);
        }
        // Access the information about the previous location
        if(location.state?.from && location.state?.from==='add_or_edit_dish') {
            setProgress(4);
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

    function addTime(setTimeArrays,new_time) {
        setTimeTempId((oldTempId) => {
            if (new_time) {
                setTimeArrays((oldtimeList) => {
                    // Check if the time already exists
                    const timeExists = oldtimeList.some(time => time.first === new_time.first && time.last === new_time.last);
                    if (!timeExists) {
                        return [...oldtimeList, { id: oldTempId, ...new_time }]
                    }
                    return oldtimeList;
                });
            } else {
                setTimeArrays((oldtimeList) => [
                    ...oldtimeList,
                    { id: oldTempId, first: '', last: '', invalid: false },
                ]);
            }
            return oldTempId + 1; // Return the updated ID
        });
    }

    function saveTime(updatedTime,setTimeArrays) {
        setTimeArrays((timeList) => timeList.map((time) => {
            if (time.id === updatedTime.id) {
                return Object.assign({}, updatedTime);
            } else {
                return time;
            }
        }
        ));
        
        // sort and merge only if there are no invalidities and no in edit
        //setTimeArrays((timelist) => (timelist.every(item => !item.invalid)) ? sort_and_merge_times(timelist) : timelist);
    }

    function deleteTime(timeId,setTimeArrays) {
        setTimeArrays((timeList) => timeList.filter((time) => {
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

    function checkTime(time,setTimeArrays) {
        let invalid = undefined;
        if (time.first!=='' && time.last!=='') {
            const first_hour = dayjs(`2023-01-01T${time.first}`);
            const last_hour = dayjs(`2023-01-01T${time.last}`);
            if (last_hour > first_hour) {
                saveTime(Object.assign({}, time, { invalid: false }),setTimeArrays);
            } else {
                if (last_hour.isSame(first_hour) && last_hour.hour()===0 && last_hour.minute() === 0) {
                    // allow 24 hours
                    saveTime(Object.assign({}, time, { invalid: false }),setTimeArrays);
                } else {
                    saveTime(Object.assign({}, time, { invalid: true }),setTimeArrays);
                    invalid = true;
                }   
            }
        } else {
            saveTime(Object.assign({}, time, { invalid: true }),setTimeArrays);
            invalid = true;
        }
        return invalid;
    }

    function addTempTimesToTimes() {
        // temporary times validation
        let invalidity = undefined;
        for (const time of temporaryTimes) {
            invalidity = checkTime(time,setTemporaryTimes);
            if (invalidity) {
                return;
            }
        }
        // check if a day has been clicked
        // in case not,message of error and don't add
        if(day.clicked === true) {
            // add also the day to temporary times
            const times_to_add = temporaryTimes.map((time) => {
                return {
                    id: time.id,
                    day: day.text,
                    first: time.first,
                    last: time.last,
                    invalid: time.invalid
                };
            })
            
            // if all ok, add the temporary times
            setTimes((oldTimes) => { return sort_and_merge_times([...oldTimes, ...times_to_add]) });
            //setTemporaryTimes([{id: times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 2, day: '', first: '', last: '', invalid: false}]);
            setDay({text:'', clicked: false});
            setErrorMsg('');
        } else {
            setErrorMsg('Select a Day of The Week');
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
                    setAddress({ text: address.text, lat: address.lat, lng: address.lng, invalid: false });
                    resolve(undefined); // Resolve with undefined for a valid address
                } else {
                    // Address is invalid
                    setAddress({ text: address.text, lat: address.lat, lng: address.lng, invalid: true });
                    reject(true); // Resolve with true for an invalid address
                }
            });
        });
    }

    function linkValidation(info, setState) {
        let invalid = undefined;
        // if link null from the db, return undefined directly (field not required)
        if (!info.link) {
            return undefined;
        }
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
                break;
            case 2:
                // timetable validation
                // at least 1 timetable required
                if (times.length === 0) {
                    invalid = true;
                    setErrorMsg('At Least One Hours Is Required');
                }
                
                // check for good values
                for (const time of times) {
                    const invalidity = checkTime(time,setTimes);
                    if (invalidity) {
                        invalid = invalidity;
                        break;
                    }
                }
                // also in temporary values, if not clicked save
                for (const time of temporaryTimes) {
                    // check only if they are not empty, since they are temporary and not required
                    if (time.first !== '' || time.last !== '') {
                        const invalidity = checkTime(time, setTemporaryTimes);
                        if (invalidity) {
                            invalid = invalidity;
                            break;
                        }
                    }
                }

                if (!invalid) {
                    // sort and merge them (only here and after temporary times to avoid changing while user do something)
                    setTimes((oldTimes) => sort_and_merge_times(oldTimes));
                    setTemporaryTimes((oldTempTimes) => sort_and_merge_times(oldTempTimes));
                    setErrorMsg('');
                }
                break;
            case 3:
                // no validation needed
                break;
            case 4:
                // no validation needed (rely on addDish and editDish screens to validate)
                break;
            default:
                break;
        }

        // go on if all ok
        if (progress < 4) {
            if (!invalid) {
                setProgress(progress + 1);
            }
        } else {
            //progress is 4 and click save button, construct the http post object and submit by invoking the API
            // construct the object to call the API
            const restaurant = {};
            restaurant.image = image;
            restaurant.name = activityName.text;
            restaurant.location = address_object_to_string(address);
            restaurant.phone = phone.text;
            restaurant.website = website.link;
            restaurant.facebook = facebook.link;
            restaurant.instagram = instagram.link;
            restaurant.twitter = twitter.link;
            restaurant.hours = time_object_to_string(times);
            restaurant.description = description.text;
            restaurant.dishes = dishes;

            if (restaurant_id) {
                // update case, add the restaurantId and 
                restaurant.id = restaurant_id;
                // call the API to update an existing restaurant
                await API.editRestaurant(restaurant).catch((err) => handleError(err));
            } else {
                // call the API to add a new restaurant
                await API.createRestaurant(restaurant).catch((err) => handleError(err));
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
                            <Form.Control isInvalid={activityName.invalid} type="text" placeholder="Enter The Activity's Name" onChange={(event) => mainInfoValidation({ text: event.target.value.trim(), invalid: activityName.invalid }, setActivityName)} defaultValue={activityName.text} />
                            <Form.Control.Feedback type="invalid">Please Insert The Activity's Name</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <AddressSelector address={address} setAddress={setAddress} isInProfilePage={false}/>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <PhoneInput className={(phone.invalid === false) ? 'custom-input' : 'custom-input is-invalid'} defaultCountry='IT' placeholder="Enter The Phone Number" value={phone.text} onChange={(event) => { phoneValidation({ text: event, invalid: phone.invalid }, setPhone) }} />
                            <p style={{ color: '#dc3545' }} className='small'>{(phone.invalid === true) ? 'Please Insert a Valid Phone Number' : ''}</p>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={description.invalid} as="textarea" rows={4} placeholder="Enter The Description" onChange={(event) => mainInfoValidation({ text: event.target.value.trim(), invalid: description.invalid }, setDescription)} defaultValue={description.text} />
                            <Form.Control.Feedback type="invalid">Please Insert A Description</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Website/Social</Form.Label>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={website.invalid} type="text" placeholder="Enter The Website Link" defaultValue={website.link} onChange={(event) => setWebsite(() => ({ link: event.target.value.trim(), invalid: (event.target.value.length === 0) ? false : website.invalid }))} />
                            <Form.Control.Feedback type="invalid">Please Insert A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={instagram.invalid} type="text" placeholder="Enter The Instagram Link" defaultValue={instagram.link} onChange={(event) => setInstagram(() => ({ link: event.target.value.trim(), invalid: (event.target.value.length === 0) ? false : instagram.invalid }))} />
                            <Form.Control.Feedback type="invalid">Please Insert A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={facebook.invalid} type="text" placeholder="Enter The Facebook Link" defaultValue={facebook.link} onChange={(event) => setFacebook(() => ({ link: event.target.value.trim(), invalid: (event.target.value.length === 0) ? false : facebook.invalid }))} />
                            <Form.Control.Feedback type="invalid">Please Insert A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Control isInvalid={twitter.invalid} type="text" placeholder="Enter The Twitter Link" defaultValue={twitter.link} onChange={(event) => setTwitter(() => ({ link: event.target.value.trim(), invalid: (event.target.value.length === 0) ? false : twitter.invalid }))} />
                            <Form.Control.Feedback type="invalid">Please Insert A Valid Link</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                </Container>
            );
            break;
        case 2:
            componentToRender = (
                <Container fluid>
                    <Container>
                        <p style={(errorMsg !== '') ?{color: '#dc3545'} : {color: '#dc3545', display:'none'}}>{errorMsg}</p>
                        <span className={(day.text === 'Mon') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({text:'Mon', clicked: true}) }}>Mon</span>
                        <span className={(day.text === 'Tue') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({text:'Tue', clicked: true}) }}>Tue</span>
                        <span className={(day.text === 'Wed') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({text:'Wed', clicked: true}) }}>Wed</span>
                        <span className={(day.text === 'Thu') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({text:'Thu', clicked: true}) }}>Thu</span>
                        <span className={(day.text === 'Fry') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({text:'Fry', clicked: true}) }}>Fry</span>
                        <span className={(day.text === 'Sat') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({text:'Sat', clicked: true}) }}>Sat</span>
                        <span className={(day.text === 'Sun') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({text:'Sun', clicked: true}) }}>Sun</span>
                        {temporaryTimes.map((temp_time) => {
                            return <EditTimeSelector key={temp_time.id} n_times={temporaryTimes.length} time={temp_time} addTime={addTime} setTimeArrays={setTemporaryTimes} saveTime={saveTime} deleteTime={deleteTime} checkTime={checkTime} />;
                        })}
                    </Container>
                    <Container className="d-flex justify-content-between mt-auto">
                        <Button variant="warning" size='sm' onClick={() => { setTemporaryTimes([{ id: times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1, day: '', first: '', last: '', invalid: false }]); setDay({text:'',clicked:false}); setErrorMsg(''); }}>Cancel</Button>
                        <Button variant="primary" size='sm' onClick={addTempTimesToTimes}>Save</Button>
                    </Container>
                    {(filter_by_day(times, 'Mon').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Mon')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime}/> : ''}
                    {(filter_by_day(times, 'Tue').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Tue')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime}/> : ''}
                    {(filter_by_day(times, 'Wed').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Wed')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime}/> : ''}
                    {(filter_by_day(times, 'Thu').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Thu')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime}/> : ''}
                    {(filter_by_day(times, 'Fry').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Fry')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime}/> : ''}
                    {(filter_by_day(times, 'Sat').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Sat')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime}/> : ''}
                    {(filter_by_day(times, 'Sun').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Sun')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime}/> : ''}
                </Container>
            );
            break;
        case 3:
            componentToRender = (
                <Container fluid>
                    <Form.Group className="mb-3" >
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Activity Image</Form.Label>
                        <ImageViewer width={"300px"} height={"300px"} image={image} setImage={setImage} fileName={fileName} setFileName={setFileName} />
                    </Form.Group>
                </Container>
            );
            break;
        case 4:
            componentToRender = (
                <>
                    <Container>
                        <ListGroup>
                            {
                                dishes.map((dish, index) => {
                                    return (<DishItem key={index} restaurantId={restaurant_id} dish={dish} deleteDish={deleteDish} />);
                                })
                            }
                        </ListGroup>
                    </Container>
                    <Container className="d-flex flex-column align-items-center width-100">
                        <Button variant='primary' onClick={() => { navigate(`/restaurants/${restaurant_id}/addDish/`) }}>Add Dish</Button>
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
                <Container fluid style={{ height: '78vh', overflowY: 'auto', marginBottom:'3%' }}>
                    {componentToRender}
                </Container>
                <Container className="d-flex justify-content-between mt-auto">
                    {(progress > 1) ? <Button variant="warning" onClick={() => { setProgress(progress - 1) }}>Back</Button> : ''}
                    {(progress < 4) ? <Button variant="primary" type='submit' className="ms-auto">Next</Button> : ''}
                    {(progress === 4 && dishes.length !== 0) ? <Button variant="primary" type='submit' className="ms-auto">Save</Button> : ''}
                </Container>
            </Form>
        </>
    );
}

function RestaurantForm(props) {
    const [progress, setProgress] = useState(1);

    return (
        <>
            <ProgressLabel progress={progress}/>
            <InnerForm progress={progress} setProgress={setProgress} />
        </>
    );
}
export { RestaurantForm };
