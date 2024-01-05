import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Home';
import { Button, Container, Form, ListGroup, Col, Row } from 'react-bootstrap';
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
import { ImageViewer, DishItem, TimeSelector, AddressSelector, address_string_to_object, address_object_to_string } from './RestaurantFormUtility';


function ProgressLabel(props) {
    const { progress } = props;

    let text;
    switch (progress) {
        case 3:
            text = 'Describe Your Menu ';
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
    // states for progress 3/3
    //const [dishes, setDishes] = useState([{ "id": 1, "name": "Pasta Carbonara", "price": 10.99, "type": "pasta", "image": IP_ADDRESS_AND_PORT + '/dishes/bismark.jpeg", "ingredients": [{ "id": 1, "dishId": 1, "image": IP_ADDRESS_AND_PORT + '/ingredients/spaghetti.png", "name": "Spaghetti", "allergens": "gluten", "brandName": "Barilla", "brandLink": "http://www.barilla.com" }, { "id": 2, "dishId": 1, "image": IP_ADDRESS_AND_PORT + '/ingredients/bacon.jpg", "name": "Bacon", "allergens": "pork", "brandName": "HomeMade", "brandLink": null }] }, { "id": 2, "name": "Margherita Pizza", "price": 12.99, "type": "pizza", "image": IP_ADDRESS_AND_PORT + '/dishes/capricciosa.jpg", "ingredients": [{ "id": 3, "dishId": 2, "image": IP_ADDRESS_AND_PORT + '/ingredients/tomato_sauce-png", "name": "Tomato Sauce", "allergens": null, "brandName": "Ragu", "brandLink": "http://www.ragu.com" }, { "id": 4, "dishId": 2, "image": IP_ADDRESS_AND_PORT + '/ingredients/mozzarella.jpg", "name": "Mozzarella Cheese", "allergens": "lactose", "brandName": "Galbani", "brandLink": "http://www.galbani.com" }] }]);
    const [dishes, setDishes] = useState([]); //PER EDIT
    const [dishName, setDishName] = useState({ text: '', invalid: false });
    const [price, setPrice] = useState({ price: 0.0, invalid: false });
    const [type, setType] = useState({ text: '', invalid: false });
    const [dishImage, setDishImage] = useState(PLACEHOLDER);
    const [fileNameDish, setFileNameDish] = useState('No File Chosen');

    const [ingredients, setIngredients] = useState([{ id: 1, name: '', allergens: [''], brandname: '', brandlink: '', invalid: false }  ]);
    const [ingredientImage, setIngredientImage] = useState([PLACEHOLDER]);
    const [fileNameIngredient, setFileNameIngredient] = useState('No File Chosen'); 
    // const [ingredientName, setIngredientName] = useState([{ text: '', invalid: false }]);
    // const [allergens, setAllergens] = useState([{ text: '', invalid: false }]);
    // const [brandname, setBrandname] = useState([{ text: '', invalid: false }]);
    // const [brandlink, setBrandlink] = useState([{ link: '', invalid: false }]);

    // const [dishes, setDishes] = useState({
    //     name: '',
    //     price: '',
    //     type: '',
    //     image:'',
    //     ingredients: [{ image:'', name: '', allergens: '', brandname: '', brandlink: '' }],
    //   });

    // temporary client id for managing the dishes inserted (find the max id in the dishes array and add 1)
    const [dishtempId, setDishTempId] = useState(dishes.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1);

    // to retrieve info of the restaurant if in edit
    useEffect(() => {
        // function used to retrieve restaurant dishes information in detail
        async function getDishes(restaurantId) {
            try {
                const dishes = await API.getDishes(restaurantId);
                // set info of the restaurant
                setActivityName({ text: restaurant.name, invalid: false });
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
                setDishes(restaurant.dishes);
            } catch (err) {
                // show error message
                console.log(err);
            }
        };
        if (restaurant_id) {
            getDishes(restaurant_id);
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

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            { name: '', allergens: [''], brandname: '', brandlink: '', invalid: false }
        ]);
    };

    const removeIngredient = (index) => {
        console.log(index);
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const addAllergen = (ingredientIndex) => {
        setIngredients(ingredients.map((ingredient, index) => {
          if (index === ingredientIndex) {
            // Adds an empty string as a new allergen in the current ingredient
            return { ...ingredient, allergens: [...ingredient.allergens, ''] };
          }
          return ingredient;
        }));
      };
      
    const removeAllergen = (ingredientIndex, allergenIndex) => {
        setIngredients(ingredients.map((ingredient, index) => {
          if (index === ingredientIndex) {
            // Removes the allergen at allergenIndex from the current ingredient
            return {
              ...ingredient,
              allergens: ingredient.allergens.filter((_, idx) => idx !== allergenIndex)
            };
          }
          return ingredient;
        }));
    };

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
                let dish_invalidity = mainInfoValidation(dishName, setDishName);
                if (dish_invalidity) {
                    invalid = dish_invalidity;
                }
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
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Main Info</Form.Label>
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
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>List of Ingredients </Form.Label>
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
                    {/* <Container>
                        <ListGroup>
                            {
                                dishes.map((dish, index) => {
                                    return (<DishItem key={index} dish={dish} deleteDish={deleteDish} />);
                                })
                            }
                        </ListGroup>
                    </Container> */}
                    <Container fluid>
                        <Form.Group className="mb-3" >
                            <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Dish Info</Form.Label>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                                <div style={{ marginBottom: '5%', flex: 7, marginRight: '8px', position: 'relative' }}>
                                    <Form.Control 
                                    isInvalid={dishName.invalid}
                                    type="text"
                                    placeholder="Dish Name"
                                    onChange={(event) => mainInfoValidation({ text: event.target.value, invalid: dishName.invalid }, setDishName)}
                                    defaultValue={dishName.text}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ position: 'absolute', top: '100%', left: 0 }}>
                                    Please Insert The Dish Name
                                    </Form.Control.Feedback>
                                </div>
                                <div style={{ marginBottom: '5%', flex: 4, position: 'relative' }} className="euro-symbol-inside">
                                    <Form.Control 
                                    isInvalid={price.invalid}
                                    type="text"
                                    placeholder="Price "
                                    onChange={(event) => mainInfoValidation({ text: event.target.value, invalid: price.invalid }, setPrice)}
                                    defaultValue={price.text}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ position: 'absolute', top: '100%', left: 0 }}>
                                    Value not valid
                                    </Form.Control.Feedback>
                                </div>
                            </div>
                            <div style={{ marginTop: '5%', marginBottom: '5%' }}>
                                <Form.Select isInvalid={type.invalid} type="text" onChange={(event) => mainInfoValidation({ text: event.target.value, invalid: type.invalid }, setType)}>
                                    <option value="" style={{width: '10%'}}>Choose Category</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="drinks">Drinks</option>
                                    <option value="hamburger">Hamburger</option>
                                    <option value="pasta">Pasta</option>
                                    <option value="pizza">Pizza</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">Select a Category!</Form.Control.Feedback>
                            </div>
                            <div style={{ marginBottom: '5%' }}>
                                        <Form.Group className="mb-3" >
                                            <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Dish Image</Form.Label>
                                            <ImageViewer width={"187.92px"} height={"187.92px"} image={dishImage} setImage={setDishImage} fileName={fileNameDish} setFileName={setFileNameDish} />
                                        </Form.Group>
                                    </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontSize: 'large', fontWeight: 'bold', marginBottom: 20, marginTop: 35 }}>List of Ingredients </Form.Label>
                            {ingredients.map((ingredient, index) => (
                                <div key={index} style={{marginBottom: 35}}>
                                    <Form.Label style={{ fontSize: 'medium', fontWeight: 'bold', marginBottom: 20 }}>Ingredient {index+1}</Form.Label>
                                    <div className="ingredient-item" style={{ marginBottom: '5%' }}>
                                        <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder={`Ingredient ${index + 1}`}
                                        isInvalid={ingredient.invalid} onChange={(event) => mainInfoValidation({ [ingredient.name]: event.target.value, invalid: [ingredient.name].invalid }, setIngredients)}
                                        />
                                        <Form.Control.Feedback type="invalid">Please insert at least one ingredient</Form.Control.Feedback>
                                            
                                        <Form.Control
                                        type="text"
                                        name="brandname"
                                        placeholder="Brand Name"
                                        isInvalid={ingredient.invalid} onChange={(event) => mainInfoValidation({ [ingredient.brandname]: event.target.value, invalid: ingredient.invalid }, setIngredients)}
                                        />
                                        <Form.Control.Feedback type="invalid">Please insert at least one ingredient</Form.Control.Feedback>
                                    </div>
                                    <div style={{ marginBottom: '5%' }}>
                                        <Form.Control
                                        type="text"
                                        name="link"
                                        placeholder="Link"
                                        isInvalid={ingredient.invalid} onChange={(event) => linkValidation({ [ingredient.brandlink]: event.target.value, invalid: ingredient.invalid }, setIngredients)}
                                        />
                                        <Form.Control.Feedback type="invalid">Please insert at least one ingredient</Form.Control.Feedback>
                                    </div>
                                    {(ingredient.allergens).map((allergen, inner_index) => (
                                        <div key={inner_index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <div style={{ marginBottom: '5%', flex: 6, marginRight: '8px' }}>
                                                <Form.Control
                                                type="text"
                                                name="allergenslist"
                                                placeholder={`Allergen ${inner_index + 1}`}
                                                isInvalid={ingredient.invalid} onChange={(event) => mainInfoValidation({ [ingredient.allergens[inner_index]]: event.target.value, invalid: ingredient.invalid }, setIngredients)}
                                                />
                                                <Form.Control.Feedback type="invalid">Please insert at least one ingredient</Form.Control.Feedback>
                                            </div>
                                            <div style={{ marginBottom: '5%', flex: 3 }}>
                                            <Button size='sm' variant="success" onClick={() => addAllergen(index)} style={{ marginRight: "2%" }}><i className="bi bi-plus-lg"></i></Button>
                                            {(ingredient.allergens.length > 1) ? <Button size='sm' variant="danger" onClick={() => removeAllergen(index, inner_index)}><i className="bi bi-trash"></i></Button> : ''}
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ marginBottom: '5%' }}>
                                        <Form.Group className="mb-3" >
                                            <Form.Label style={{ fontSize: 'medium', fontWeight: 'bold' }}>Ingredient {index+1} Image</Form.Label>
                                            <ImageViewer width={"100px"} height={"100px"} image={ingredientImage} setImage={setIngredientImage} fileName={fileNameIngredient} setFileName={setFileNameIngredient} />
                                        </Form.Group>
                                    </div>
                                    <Button size='sm' variant="success" onClick={addIngredient} style={{ marginRight: "2%" }}><i className="bi bi-plus-lg"></i></Button>
                                    {(ingredients.length > 1) ? <Button size='sm' variant="danger" onClick={() => removeIngredient(index)}><i className="bi bi-trash"></i></Button> : ''}
                                </div>
                            ))}
                        </Form.Group>
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
                    {(progress < 3) ? <Button variant="primary" type='submit' className="ms-auto">Next</Button> : <Button variant="primary" type='submit' className="ms-auto">Add Dish</Button>}
                    {(progress === 3 && dishes.length !== 0) ? <Button variant="primary" type='submit' className="ms-auto">Save</Button> : ''}
                </Container>
            </Form>
        </>
    );
}

function DishForm(props) {
    const [progress, setProgress] = useState(3);

    return (
        <>
            <Header />
            <ProgressLabel progress={progress} />
            <InnerForm progress={progress} setProgress={setProgress} />
        </>
    );
}
export { DishForm };
