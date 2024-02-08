import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Home';
import { Button, Container, Form, ListGroup, Col, Row, Dropdown, Modal, CloseButton } from 'react-bootstrap';
import { PLACEHOLDER } from './Costants';
import dayjs from 'dayjs';
import validator from 'validator';
import API from '../API';
import 'react-phone-number-input/style.css'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import { ImageViewer, DishItem, EditTimeSelector, AddressSelector, address_string_to_object, address_object_to_string, ViewTimeSelector, ViewDailyTimeSelector, time_string_to_object, time_object_to_string, filter_by_day, sort_and_merge_times } from './RestaurantFormUtility';
import { ErrorContext } from './userContext';
import { DishForm } from './DishForm';
import ConfirmModal from './ConfirmModal';

const handleFileNames = (filename) => {
    // change the file name only if there is a new path, otherwise keep the old filename
    if (!filename.startsWith("data:image")) {
        if (filename === 'placeholder2.png') {
            return 'No File Chosen';
        } else {
            return filename;
        }
    }
    // no file name to update return undefined
    return undefined;
}

function SuccessModal(props) {
    const { text, show, setShow, action, parameter } = props;

    const perform_action = () => {
        if (parameter == undefined) {
            action();
            setShow(false);
        } else {
            action(parameter);
            setShow(false);
        }
    };

    return (
        <Modal show={show} onHide={perform_action} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Operation Successful</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: 'flex', alignItems: 'center' }}>
                {text}&nbsp;&nbsp;<i className="bi bi-check-circle-fill" style={{ fontSize: '24px', color: '#198754' }}></i>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={perform_action}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}

function ProgressLabel(props) {
    const { progress, editMenu } = props;

    let text;
    switch (progress) {
        case 1:
            text = 'Insert Info ';
            break;
        case 2:
            text = 'Insert your Timetable ';
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
        <h1 className="text-center" style={{ marginTop: '3%' }}>{text}{(editMenu) ? '' : `(${progress}/4)`}</h1>
    );
}

function InnerForm(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const handleError = useContext(ErrorContext);
    const restaurant_id = useParams().id;
    const { progress, setProgress, editMenu } = props;
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
    const [day, setDay] = useState({ text: '', clicked: false });
    const [temporaryTimes, setTemporaryTimes] = useState([{ id: times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1, day: '', first: '', last: '', invalid: false }]);
    const [errorMsg, setErrorMsg] = useState('');
    // state for showing the add time form or not
    const [showTimeForm, setShowTimeForm] = useState(false);
    // temporary client id for managing the time intervals (find the max id in the times array and add 1)
    const [timetempId, setTimeTempId] = useState(times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 2);
    // function to reset temporary times
    const reset = () => {
        setTemporaryTimes([{ id: times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1, day: '', first: '', last: '', invalid: false }]);
        setDay({ text: '', clicked: false });
        setErrorMsg('');
    };
    // state for showing the reset timetable modal
    const [showResetTimetable, setShowResetTimetable] = useState(false);

    // states for progress 3/4
    const [image, setImage] = useState(PLACEHOLDER);
    const [fileName, setFileName] = useState('No File Chosen');

    // states for progress 4/4
    //const [dishes, setDishes] = useState([{ "id": 1, "name": "Pasta Carbonara", "price": 10.99, "type": "pasta", "image": "http://localhost:3001/dishes/bismark.jpeg", "ingredients": [{ "id": 1, "dishId": 1, "image": "http://localhost:3001/ingredients/spaghetti.png", "name": "Spaghetti", "allergens": "gluten", "brandName": "Barilla", "brandLink": "http://www.barilla.com" }, { "id": 2, "dishId": 1, "image": "http://localhost:3001/ingredients/bacon.jpg", "name": "Bacon", "allergens": "pork", "brandName": "HomeMade", "brandLink": null }] }, { "id": 2, "name": "Margherita Pizza", "price": 12.99, "type": "pizza", "image": "http://localhost:3001/dishes/capricciosa.jpg", "ingredients": [{ "id": 3, "dishId": 2, "image": "http://localhost:3001/ingredients/tomato_sauce-png", "name": "Tomato Sauce", "allergens": null, "brandName": "Ragu", "brandLink": "http://www.ragu.com" }, { "id": 4, "dishId": 2, "image": "http://localhost:3001/ingredients/mozzarella.jpg", "name": "Mozzarella Cheese", "allergens": "lactose", "brandName": "Galbani", "brandLink": "http://www.galbani.com" }] }]);
    const [dishes, setDishes] = useState([]);
    // state for displaying error message when no dish is added
    const [noDishError, setNoDishError] = useState('');
    // temporary client id for managing the dishes inserted (find the max id in the dishes array and add 1)
    const [dishtempId, setDishTempId] = useState(dishes.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1);
    const prevDishesLength = useRef(dishes.length);

    // DISH SECTION STATES
    const [dishName, setDishName] = useState({ text: '', invalid: false });
    const [price, setPrice] = useState({ price: '', invalid: false });
    const [type, setType] = useState({ text: '', invalid: false });
    const [dishImage, setDishImage] = useState(PLACEHOLDER);
    const [fileNameDish, setFileNameDish] = useState('No File Chosen');
    const [ingredients, setIngredients] = useState([{ id: 0, text: '', image: PLACEHOLDER, fileName: 'No File Chosen', allergens: null, brandname: '', brandLink: '', invalid_text: false, invalid_allergens: false, invalid_brandname: false, invalid_link: false }]);
    // temporary client id for managing the ingredients (find the max id in the ingredients array and add 1)
    const [ingredientTempId, setIngredientTempId] = useState(ingredients.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1);
    const [show, setShow] = useState(false);
    // state for going into the dish section
    const [manageDish, setManageDish] = useState(undefined);

    // state for operation confirmed
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const action_to_perform = () => {
        //then return home if Click Save Button, if in Add/Edit Dish, return to 4/4
        if (manageDish) {
            setProgress(4);
        } else {
            setProgress(1);
            navigate('/');
        }
    };

    // TO ENSURE CORRECT TEMPORARY ID OF THE TIMES UPDATE
    useEffect(() => {
        // Check if the length of dishes array has changed
        // TRIGGERED BY DISHES
        if (dishes.length !== prevDishesLength.current) {
            // Update dishtempId when dishes state changes
            setDishTempId(
                dishes.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1
            );
            // Update the length
            prevDishesLength.current = dishes.length;
        }
    }, [dishes]);

    useEffect(() => {
        // TRIGGERED BY TIMES
        // Always do, even if length does not changed, means times merged so update it anyway
        // Update temporaryTimes and timetempId when times state changes
        // only if valid
        if (!temporaryTimes.some(time => time.invalid)) {
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
                setFileName(restaurant.image.split('/')[restaurant.image.split('/').length - 1]);
                setDishes(restaurant.dishes.map(dish => {
                    // Extract file name from image URL
                    let imageName = dish.image.substring(dish.image.lastIndexOf('/') + 1);
                    // Add fileName field to the object
                    dish.fileName = handleFileNames(imageName) || '';
                    // Iterate through ingredients if present
                    if (dish.ingredients && dish.ingredients.length > 0) {
                        dish.ingredients.forEach(ingredient => {
                            // Extract file name from ingredient image URL
                            let ingredientImageName = ingredient.image.substring(ingredient.image.lastIndexOf('/') + 1);
                            // Add fileName field to the ingredient object
                            ingredient.fileName = handleFileNames(ingredientImageName) || '';
                        });
                    }
                    return dish;
                }));
                //setDishTempId(dishes.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1);
            } catch (err) {
                // show error message
                handleError(err);
            }
        };
        if (restaurant_id) {
            getRestaurant(restaurant_id);
        }
        // Access the information about the previous location
        if (location.state?.from && location.state?.from === 'add_or_edit_dish') {
            setProgress(4);
        }
    }, []);

    function resetStates() {
        setManageDish(undefined);
        setDishName({ text: '', invalid: false });
        setPrice({ price: '', invalid: false });
        setType({ text: '', invalid: false });
        setDishImage(PLACEHOLDER);
        setFileNameDish('No File Chosen');
        setIngredients([{ id: 0, text: '', image: PLACEHOLDER, fileName: 'No File Chosen', allergens: null, brandname: '', brandLink: '', invalid_text: false, invalid_allergens: false, invalid_brandname: false, invalid_link: false }]);
        setIngredientTempId(ingredients.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1);
    };

    function createDishObject(dishId) {
        const dishObject = {
            id: dishId,
            name: dishName.text,
            price: parseFloat(price.price),
            type: type.text,
            image: dishImage,
            fileName: fileNameDish,
            ingredients: ingredients.map((ingredient) => ({
                id: ingredient.id,
                dishId: dishId,  // Assuming you have a fixed dishId or generate it accordingly
                image: ingredient.image,  // Adjust accordingly
                fileName: ingredient.fileName,
                name: ingredient.text,
                allergens: ingredient.allergens,
                brandName: ingredient.brandname,
                brandLink: ingredient.brandLink || null,
            })),
        };

        return dishObject;
    }

    function addDish() {
        const new_dish = createDishObject(undefined);
        //console.log(new_dish)
        setDishes((oldDishList) => [...oldDishList, Object.assign({}, { ...new_dish, id: dishtempId })]);
        // reset
        resetStates();
    }

    function editDish() {
        const updated_dish = createDishObject(manageDish.id);
        setDishes((dishes) => dishes.map((dish) => {
            if (dish.id === updated_dish.id) {
                return Object.assign({}, updated_dish);
            } else {
                return dish;
            }
        }
        ));
        // reset
        resetStates();
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

    function addTime(setTimeArrays, new_time) {
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

    function saveTime(updatedTime, setTimeArrays) {
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

    function deleteTime(timeId, setTimeArrays) {
        setTimeArrays((timeList) => timeList.filter((time) => {
            if (time.id !== timeId) {
                return true;
            } else {
                return false;
            }
            return true;
        }
        ));
    }

    function checkTime(time, setTimeArrays) {
        let invalid = undefined;
        if (time.first !== '' && time.last !== '') {
            const first_hour = dayjs(`2023-01-01T${time.first}`);
            const last_hour = dayjs(`2023-01-01T${time.last}`);
            if (last_hour > first_hour) {
                saveTime(Object.assign({}, time, { invalid: false }), setTimeArrays);
            } else {
                saveTime(Object.assign({}, time, { invalid: true }), setTimeArrays);
                invalid = true;
            }
        } else {
            saveTime(Object.assign({}, time, { invalid: true }), setTimeArrays);
            invalid = true;
        }
        return invalid;
    }

    function addTempTimesToTimes() {
        // temporary times validation
        let invalidity = undefined;
        for (const time of temporaryTimes) {
            invalidity = checkTime(time, setTemporaryTimes);
            if (invalidity) {
                return;
            }
        }
        // check if a day has been clicked
        // in case not,message of error and don't add
        if (day.clicked === true) {
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
            setDay({ text: '', clicked: false });
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

    function mainInfoDishValidation(info, setState, ingredient_field) {
        let invalid = undefined;
        if (!ingredient_field) {
            if (info.text.length === 0) {
                invalid = true;
                setState({ text: info.text, invalid: true });
            } else {
                setState({ text: info.text, invalid: false });
            }
        } else {
            // ingredient validation
            let text_or_brandname;
            if (ingredient_field === 'text') {
                text_or_brandname = info.text;
            } else if (ingredient_field === 'brandname') {
                text_or_brandname = info.brandname;
            }

            if (text_or_brandname.length === 0) {
                invalid = true;
                setState((oldIngredients) => oldIngredients.map((oldingredient) => {
                    if (oldingredient.id === info.id) {
                        if (ingredient_field === 'text') {
                            return { ...oldingredient, text: info.text, invalid_text: true };
                        } else if (ingredient_field === 'brandname') {
                            return { ...oldingredient, brandname: info.brandname, invalid_brandname: true };
                        }
                    }
                    return oldingredient;
                }));
                //console.log(ingredients);
            } else {
                setState((oldIngredients) => oldIngredients.map((oldingredient) => {
                    if (oldingredient.id === info.id) {
                        if (ingredient_field === 'text') {
                            return { ...oldingredient, text: info.text, invalid_text: false };
                        } else if (ingredient_field === 'brandname') {
                            return { ...oldingredient, brandname: info.brandname, invalid_brandname: false };
                        }
                    }
                    return oldingredient;
                }));
            }
        }

        return invalid;
    }

    function priceValidation(info) {
        let invalid = undefined;
        if (!validator.isFloat(info.price.toString()) || parseFloat(info.price.toString()) <= 0) {
            setPrice({ price: info.price, invalid: true });
            invalid = true;
        } else {
            setPrice({ price: info.price, invalid: false });
        }
        return invalid;
    }

    function ingredientLinkValidation(info, setState) {
        let invalid = undefined;
        // if link null from the db, return undefined directly (field not required)
        if (!info.brandLink) {
            return undefined;
        }

        if ((info.brandLink.length !== 0 && !validator.isURL(info.brandLink))) {
            invalid = true;
            setState((oldIngredients) => oldIngredients.map((oldingredient) => {
                if (oldingredient.id === info.id) {
                    return { ...oldingredient, invalid_link: true };
                }
                return oldingredient;
            }));
        } else {
            setState((oldIngredients) => oldIngredients.map((oldingredient) => {
                if (oldingredient.id === info.id) {
                    return { ...oldingredient, invalid_link: false };
                }
                return oldingredient;
            }));
        }
        return invalid;
    }

    /*function allergen_validation(info) {
        let invalid = undefined;
        const allergens = (info.allergens && info.allergens.length > 0) ? info.allergens.split(',') : [];
        for (const allergen of allergens) {
            if (allergen.trim().length === 0) {
                invalid = true;
                setIngredients((oldIngredients) => oldIngredients.map((oldingredient) => {
                    if (oldingredient.id === info.id) {
                        return { ...info, invalid_allergens: true };
                    }
                    return oldingredient;
                }));
            } else {
                setIngredients((oldIngredients) => oldIngredients.map((oldingredient) => {
                    if (oldingredient.id === info.id) {
                        return { ...info, invalid_allergens: false };
                    }
                    return oldingredient;
                }));
            }
        }
        return invalid;
    }*/

    const handleSubmit = async (event, submit) => {
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
                    const invalidity = checkTime(time, setTimes);
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
                    // reset everything, also close the hour form
                    reset();
                    setShowTimeForm(false);
                }
                break;
            case 3:
                // no validation needed
                break;
            case 4:
                // Validate Dish Name if gone in add edit dish
                if (manageDish) {
                    let dish_name_invalidity = mainInfoDishValidation(dishName, setDishName, false);
                    if (dish_name_invalidity) {
                        invalid = dish_name_invalidity;
                    }
                    // Validate Dish Price
                    let dish_price_invalidity = priceValidation(price);
                    if (dish_price_invalidity) {
                        invalid = dish_price_invalidity;
                    }
                    // Validate Category type
                    let category_invalidity = mainInfoDishValidation(type, setType, false);
                    if (category_invalidity) {
                        invalid = category_invalidity;
                    }

                    // Validate each ingredient
                    ingredients.forEach((ingredient) => {
                        // Validate Ingredient Name
                        let ingredient_name_invalidity = mainInfoDishValidation(ingredient, setIngredients, 'text');
                        if (ingredient_name_invalidity) {
                            invalid = ingredient_name_invalidity;
                        }
                        // Validate Ingredient Brand Name
                        let ingredient_Brandname_invalidity = mainInfoDishValidation(ingredient, setIngredients, 'brandname');
                        if (ingredient_Brandname_invalidity) {
                            invalid = ingredient_Brandname_invalidity;
                        }
                        // Validate Ingredient Brand Link
                        let ingredient_Brandlink_invalidity = ingredientLinkValidation(ingredient, setIngredients);
                        if (ingredient_Brandlink_invalidity) {
                            invalid = ingredient_Brandlink_invalidity;
                        }
                        /* Validate Allergens
                        let ingredient_allergens_invalidity = allergen_validation(ingredient);
                        if (ingredient_allergens_invalidity) {
                            invalid = ingredient_allergens_invalidity;
                        }*/
                    });
                } else {
                    // if no dishes, trigger the error and prevent the submit
                    if (dishes.length <= 0) {
                        setNoDishError('Insert at Least One Dish To Continue');
                        invalid = true;
                    }
                }
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
            if (!invalid) {
                if (manageDish && manageDish.id) {
                    // edit dish
                    editDish();
                    setNoDishError('');
                } else if (manageDish) {
                    // add dish
                    addDish();
                    setNoDishError('');
                }
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

                if (submit) {
                    try {
                        if (restaurant_id) {
                            // update case, add the restaurantId and 
                            restaurant.id = restaurant_id;
                            // call the API to update an existing restaurant
                            await API.editRestaurant(restaurant);
                            setShowConfirm(true);
                            setConfirmText('Restaurant Edited Successfully');
                        } else {
                            // call the API to add a new restaurant
                            await API.createRestaurant(restaurant);
                            setShowConfirm(true);
                            setConfirmText('Restaurant Added Successfully');
                        }
                    } catch (error) {
                        handleError(error);
                    }
                }
                //then return home if Click Save Button, if in Add/Edit Dish, return to 4/4
                /*if (manageDish) {
                    setProgress(4);
                } else {
                    setProgress(1);
                    navigate('/');
                }*/
            }
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
                            <Form.Label className='formLabelRestaurant'>Activity Name</Form.Label>
                            <Form.Control className="form-control-green-focus" isInvalid={activityName.invalid} type="text" onChange={(event) => setActivityName({ text: event.target.value.trim(), invalid: false })} defaultValue={activityName.text} />
                            <Form.Control.Feedback type="invalid">Enter The Activity's Name</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Label className='formLabelRestaurant'>Location</Form.Label>
                            <AddressSelector address={address} setAddress={setAddress} isInProfilePage={false} />
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Label className='formLabelRestaurant'>Phone Number</Form.Label>
                            <PhoneInput className={(phone.invalid === false) ? 'custom-input form-control-green-focus' : 'custom-input is-invalid form-control-green-focus'} defaultCountry='IT' value={phone.text} onChange={(event) => { setPhone({ text: event, invalid: false }) }} />
                            <p style={{ color: '#dc3545' }} className='small'>{(phone.invalid === true) ? 'Enter a Valid Phone Number' : ''}</p>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Label className='formLabelRestaurant'>Description</Form.Label>
                            <Form.Control className="form-control-green-focus" isInvalid={description.invalid} as="textarea" rows={4} onChange={(event) => setDescription({ text: event.target.value.trim(), invalid: false })} defaultValue={description.text} />
                            <Form.Control.Feedback type="invalid">Enter A Description</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Website/Social</Form.Label>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Label className='formLabelRestaurant'>Website Link <i style={{ color: 'gray' }}>(optional)</i></Form.Label>
                            <Form.Control className="form-control-green-focus" isInvalid={website.invalid} type="text" defaultValue={website.link} onChange={(event) => setWebsite({ link: event.target.value.trim(), invalid: false })} />
                            <Form.Control.Feedback type="invalid">Enter A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Label className='formLabelRestaurant'>Instagram Link <i style={{ color: 'gray' }}>(optional)</i></Form.Label>
                            <Form.Control className="form-control-green-focus" isInvalid={instagram.invalid} type="text" defaultValue={instagram.link} onChange={(event) => setInstagram({ link: event.target.value.trim(), invalid: false })} />
                            <Form.Control.Feedback type="invalid">Enter A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Label className='formLabelRestaurant'>Facebook Link <i style={{ color: 'gray' }}>(optional)</i></Form.Label>
                            <Form.Control className="form-control-green-focus" isInvalid={facebook.invalid} type="text" defaultValue={facebook.link} onChange={(event) => setFacebook({ link: event.target.value.trim(), invalid: false })} />
                            <Form.Control.Feedback type="invalid">Enter A Valid Link</Form.Control.Feedback>
                        </div>
                        <div style={{ marginBottom: '5%' }}>
                            <Form.Label className='formLabelRestaurant'>Twitter Link <i style={{ color: 'gray' }}>(optional)</i></Form.Label>
                            <Form.Control className="form-control-green-focus" isInvalid={twitter.invalid} type="text" defaultValue={twitter.link} onChange={(event) => setTwitter({ link: event.target.value.trim(), invalid: false })} />
                            <Form.Control.Feedback type="invalid">Enter A Valid Link</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                </Container>
            );
            break;
        case 2:
            componentToRender = (
                <Container fluid>
                    {(filter_by_day(times, 'Mon').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Mon')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime} /> : ''}
                    {(filter_by_day(times, 'Tue').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Tue')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime} /> : ''}
                    {(filter_by_day(times, 'Wed').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Wed')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime} /> : ''}
                    {(filter_by_day(times, 'Thu').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Thu')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime} /> : ''}
                    {(filter_by_day(times, 'Fry').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Fry')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime} /> : ''}
                    {(filter_by_day(times, 'Sat').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Sat')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime} /> : ''}
                    {(filter_by_day(times, 'Sun').length !== 0) ? <ViewDailyTimeSelector times={filter_by_day(times, 'Sun')} n_times={times.length} deleteTime={deleteTime} setTimeArrays={setTimes} saveTime={saveTime} checkTime={checkTime} /> : ''}
                    {/*<Container className="d-flex justify-content-between" style={{marginTop: '3%'}}>
                        <Button variant="danger" size='sm' onClick={() => { setTemporaryTimes([{ id: times.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1, day: '', first: '', last: '', invalid: false }]); setDay({text:'',clicked:false}); setErrorMsg('');}}>Reset</Button>
                        <Button variant="success" size='sm' onClick={addTempTimesToTimes}>Add</Button>
                    </Container>*/}
                </Container>
            );
            break;
        case 3:
            componentToRender = (
                <Container fluid>
                    <Form.Group className="mb-3" >
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Activity Image <i style={{ color: 'gray' }}>(optional)</i></Form.Label>
                        <ImageViewer width={"300px"} height={"300px"} image={image} setImage={setImage} fileName={fileName} setFileName={setFileName} />
                    </Form.Group>
                </Container>
            );
            break;
        case 4:
            {
                manageDish ? componentToRender = (
                    <DishForm
                        dish={(manageDish.id) ? dishes.filter((dish) => dish.id === manageDish.id)[0] : undefined}
                        dishName={dishName}
                        setDishName={setDishName}
                        price={price}
                        setPrice={setPrice}
                        type={type}
                        setType={setType}
                        dishImage={dishImage}
                        setDishImage={setDishImage}
                        fileNameDish={fileNameDish}
                        setFileNameDish={setFileNameDish}
                        ingredients={ingredients}
                        setIngredients={setIngredients}
                        ingredientTempId={ingredientTempId}
                        setIngredientTempId={setIngredientTempId}
                    />
                ) :
                    componentToRender = (
                        <>
                            <Container>
                                <p style={(noDishError !== '') ?{color: '#dc3545'} : {color: '#dc3545', display:'none'}}>{noDishError}</p>
                                <ListGroup>
                                    {
                                        dishes.sort((a, b) => {
                                            const nameA = a.name.toUpperCase();
                                            const nameB = b.name.toUpperCase();

                                            if (nameA < nameB) {
                                                return -1;
                                            }
                                            if (nameA > nameB) {
                                                return 1;
                                            }
                                            return 0;
                                        }).map((dish, index) => {
                                            return (<DishItem key={index} dish={dish} deleteDish={deleteDish} setManageDish={setManageDish} />);
                                        })
                                    }
                                </ListGroup>
                            </Container>
                        </>
                    );
            }
            break;
        default:
            componentToRender = <p>No matching case found</p>;
    }

    return (
        <>
            <ConfirmModal text={'Undo The Changes Made'} show={show} setShow={setShow} action={() => resetStates()} />
            <ConfirmModal text={'Reset Your Timetable'} show={showResetTimetable} setShow={setShowResetTimetable} action={() => setTimes([])} />
            <SuccessModal text={confirmText} show={showConfirm} setShow={setShowConfirm} action={action_to_perform} />
            <Form noValidate onSubmit={handleSubmit}>
                {(progress === 4 && manageDish === undefined) ?
                    <>
                        <Container fluid style={{ height: '65.2vh', overflowY: 'auto', marginBottom: '3%' }}>{componentToRender}</Container>
                        <Container className="d-flex flex-column align-items-center width-100">
                            <Button className='light-green' onClick={() => { setManageDish({ route: 'add_dish', id: undefined }) }}>Add Dish</Button>
                        </Container>
                    </> : (progress === 2 && showTimeForm) ?
                        <span>
                            <Container fluid>
                                <Container style={(showTimeForm) ? {} : { display: 'none' }}>
                                    <p style={(errorMsg !== '') ? { color: '#dc3545', marginBottom:'0%' } : { color: '#dc3545', display: 'none' }}>{errorMsg}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
                                        <strong style={{ fontSize: 'large' }}>Select Opening Day and Hours:</strong>
                                        <CloseButton onClick={() => { reset(); setShowTimeForm(false); }} />
                                    </div>

                                    <span className={(day.text === 'Mon') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({ text: 'Mon', clicked: true }) }}>Mon</span>
                                    <span className={(day.text === 'Tue') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({ text: 'Tue', clicked: true }) }}>Tue</span>
                                    <span className={(day.text === 'Wed') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({ text: 'Wed', clicked: true }) }}>Wed</span>
                                    <span className={(day.text === 'Thu') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({ text: 'Thu', clicked: true }) }}>Thu</span>
                                    <span className={(day.text === 'Fry') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({ text: 'Fry', clicked: true }) }}>Fry</span>
                                    <span className={(day.text === 'Sat') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({ text: 'Sat', clicked: true }) }}>Sat</span>
                                    <span className={(day.text === 'Sun') ? "round-icon-selected" : "round-icon"} onClick={() => { setDay({ text: 'Sun', clicked: true }) }}>Sun</span>
                                    {temporaryTimes.map((temp_time) => {
                                        return <EditTimeSelector key={temp_time.id} n_times={temporaryTimes.length} time={temp_time} add={addTempTimesToTimes} setTimeArrays={setTemporaryTimes} saveTime={saveTime} checkTime={checkTime}
                                            reset={reset} />;
                                    })}
                                    <hr style={{ borderTop: "1px solid #000" }} />
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5%' }}>
                                        {(showTimeForm) ? '' : <Button size='sm' className='light-green' onClick={() => { reset(); setShowTimeForm(true); }}>Add Hours</Button>}
                                        {(times.length > 0) ? <Button size='sm' variant='danger' style={{ marginLeft: 'auto' }} onClick={() => { setShowResetTimetable(true) }}>Reset Timetable</Button> : <Button size='sm' variant='danger' style={{ visibility:'hidden' }}>Reset Timetable</Button>}
                                    </div>
                                </Container>
                            </Container>
                            <Container fluid style={(errorMsg !== '') ? { height: '40.2vh', overflowY: 'auto', marginBottom: '3%' } : (temporaryTimes.some(time => time.invalid)) ? { height: '41.4vh', overflowY: 'auto', marginBottom: '3%' } : { height: '44.1vh', overflowY: 'auto', marginBottom: '3%' }}>{componentToRender}</Container>
                        </span>
                        : (progress === 2 && !showTimeForm) ?
                        <span>
                            <Container fluid>
                                <Container>
                                    <p style={(errorMsg !== '') ? { color: '#dc3545', marginBottom:'2%' } : { color: '#dc3545', display: 'none' }}>{errorMsg}</p>
                                </Container>
                                <Container style={{ display: 'flex', alignItems: 'center', marginBottom: '5%' }}>
                                    {(showTimeForm) ? '' : <Button size='sm' className='light-green' onClick={() => { reset(); setShowTimeForm(true); }}>Add Hours</Button>}
                                    {(times.length > 0) ? <Button size='sm' variant='danger' style={{ marginLeft: 'auto' }} onClick={() => { setShowResetTimetable(true) }}>Reset Timetable</Button> : ''}
                                </Container>
                            </Container>
                            <Container fluid style={(errorMsg !== '') ? { height: '59.9vh', overflowY: 'auto', marginBottom: '3%' } : { height: '63.8vh', overflowY: 'auto', marginBottom: '3%' }}>{componentToRender}</Container>
                        </span> : 
                        <Container fluid style={{ height: '70vh', overflowY: 'auto', marginBottom: '3%' }}>{componentToRender}</Container>}
                <Container className="d-flex justify-content-between mt-auto">
                    {(manageDish !== undefined && manageDish.route !== undefined && progress === 4) ? <Button className='dark-yellow' onClick={() => { setShow(true) }}>Back</Button> : ''}
                    {(progress > 1 && manageDish === undefined && editMenu === false) ? <Button className='dark-yellow' onClick={() => { setProgress(progress - 1) }}>Back</Button> : ''}
                    {(progress < 4) ? <Button onClick={handleSubmit} className="ms-auto light-green">Next</Button> : ''}
                    {(progress === 4 && manageDish === undefined) ? <Button variant="success" onClick={(event) => handleSubmit(event, true)} className="ms-auto">Save</Button> : ''}
                    {(manageDish !== undefined && manageDish.id !== undefined && progress === 4) ? <Button variant="success" onClick={handleSubmit} className="ms-auto">Edit Dish</Button> : ''}
                    {(manageDish !== undefined && manageDish.id === undefined && progress === 4) ? <Button variant="success" onClick={handleSubmit} className="ms-auto">Add Dish</Button> : ''}
                </Container>
            </Form>
        </>
    );
}

function RestaurantForm(props) {
    const location = useLocation();
    const { progress, setProgress } = props;
    const [editMenu, setEditMenu] = useState(false);

    useEffect(() => {
        // Access the information about the previous location
        // If i came from the settings route and i click edit your menu do logic for masking 
        if (location.state?.from && location.state?.from === 'edit_menu') {
            setEditMenu(true);
        }
    }, []);

    return (
        <>
            <ProgressLabel progress={progress} editMenu={editMenu} />
            <InnerForm progress={progress} setProgress={setProgress} editMenu={editMenu} />
        </>
    );
}
export { RestaurantForm };
