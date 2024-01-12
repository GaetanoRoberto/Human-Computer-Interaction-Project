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
//import { ImageViewer, address_string_to_object, address_object_to_string } from './RestaurantFormUtility';
import { ImageViewer, DishItem, AddressSelector, address_string_to_object, address_object_to_string } from './RestaurantFormUtility';


function ProgressLabel(props) {
    const { progress } = props;

    let text;
    switch (progress) {
        case 4:
            text = 'Describe Your Menu ';
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
    const navigate = useNavigate();
    const { id, dishId } = useParams();
    const { progress, setProgress } = props;
    // states for progress 3/3
    //const [dishes, setDishes] = useState([{ "id": 1, "name": "Pasta Carbonara", "price": 10.99, "type": "pasta", "image": IP_ADDRESS_AND_PORT + '/dishes/bismark.jpeg", "ingredients": [{ "id": 1, "dishId": 1, "image": IP_ADDRESS_AND_PORT + '/ingredients/spaghetti.png", "name": "Spaghetti", "allergens": "gluten", "brandName": "Barilla", "brandLink": "http://www.barilla.com" }, { "id": 2, "dishId": 1, "image": IP_ADDRESS_AND_PORT + '/ingredients/bacon.jpg", "name": "Bacon", "allergens": "pork", "brandName": "HomeMade", "brandLink": null }] }, { "id": 2, "name": "Margherita Pizza", "price": 12.99, "type": "pizza", "image": IP_ADDRESS_AND_PORT + '/dishes/capricciosa.jpg", "ingredients": [{ "id": 3, "dishId": 2, "image": IP_ADDRESS_AND_PORT + '/ingredients/tomato_sauce-png", "name": "Tomato Sauce", "allergens": null, "brandName": "Ragu", "brandLink": "http://www.ragu.com" }, { "id": 4, "dishId": 2, "image": IP_ADDRESS_AND_PORT + '/ingredients/mozzarella.jpg", "name": "Mozzarella Cheese", "allergens": "lactose", "brandName": "Galbani", "brandLink": "http://www.galbani.com" }] }]);
    const [dishes, setDishes] = useState([]);

    const [dishName, setDishName] = useState({ text: '', invalid: false });
    const [price, setPrice] = useState({ price: 0.0, invalid: false });
    const [type, setType] = useState({ text: '', invalid: false });
    const [dishImage, setDishImage] = useState(PLACEHOLDER);
    const [fileNameDish, setFileNameDish] = useState('No File Chosen');
    const [ingredients, setIngredients] = useState([{ id: 0, name: '', allergens: '', brandname: '', brandlink: '', invalid: false }  ]);
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
        // function used to retrieve restaurant information in detail
        async function getRestaurant(id) {
            try {
                const restaurant = await API.getRestaurant(id);
                // Find the dish with the matching dishId
                const selectedDish = restaurant.dishes.find((dish) => dish.id == dishId);
                console.log(selectedDish);
                // Now, selectedDish contains the dish object with the matching id
                if (selectedDish) {
                    // You can access selectedDish properties and use them in your component
                    // set info of the dish
                    setDishName({ text: selectedDish.name, invalid: false });
                    setPrice({ text: selectedDish.price, invalid: false });
                    setType({ text: selectedDish.type, invalid: false });
                    setDishImage(selectedDish.image);
                    //setFileNameDish({ text: dish.name, invalid: false });
                    //setIngredients([{, name: '', allergens: [''], brandname: '', brandlink: '', invalid: false }  ]);
                    // Fill the ingredients state based on selectedDish.ingredients
                    const updatedIngredients = selectedDish.ingredients.map(ingredient => ({
                        id: ingredient.id, // Assuming id is unique for each ingredient
                        name: ingredient.name || '',
                        allergens: ingredient.allergens || '',
                        brandname: ingredient.brandName || '',
                        brandlink: ingredient.brandLink || '',
                        invalid: false
                    }));

                    if (selectedDish.ingredients.length == 0){
                        setIngredients([{ id: 0, name: '', allergens: '', brandname: '', brandlink: '', invalid: false }  ]);
                    } else {
                        setIngredients(updatedIngredients);
                        console.log(ingredients);
                    }
                    
                    // Fill the ingredientImage state with placeholders or actual images if available
                    const updatedIngredientImages = selectedDish.ingredients.map((ingredient, index) => {
                        // Assuming you have an 'image' property for each ingredient
                        return ingredient.image || PLACEHOLDER;
                    });
                    
                    if (selectedDish.ingredients.length == 0){
                        setIngredientImage([PLACEHOLDER]);
                    } else {
                        setIngredientImage(updatedIngredientImages);
                    }
                    //setFileNameIngredient({ text: dish.name, invalid: false });
                    //setDishes(selectedDish);
                } else {
                    // Handle the case when the dish with dishId is not found
                    console.log('Dish not found');
                }
            } catch (err) {
                // show error message
                console.log(err);
            }
        };
        if (id) {
            getRestaurant(id);
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
            { name: '', allergens: '', brandname: '', brandlink: '', invalid: false }
        ]);
        setIngredientImage([
            ...ingredientImage,
            PLACEHOLDER
        ]);
    };

    const removeIngredient = (index) => {
        console.log(index);
        const newIngredients = ingredients.filter((_, i) => i !== index);
        console.log(newIngredients);
        setIngredients(newIngredients);
    };

    const handleAllergenChange = (ingredientIndex, allergenIndex, newValue) => {
        // Clone the current ingredients array
        const newIngredients = [...ingredients];
    
        // Split the allergens string into an array, update the relevant allergen, and join back into a string
        let allergens = newIngredients[ingredientIndex].allergens.split(',');
        allergens[allergenIndex] = newValue;
        newIngredients[ingredientIndex].allergens = allergens.join(',');
    
        // Update the state
        setIngredients(newIngredients);
    };
    
    const addAllergen = (currentIngredient, ingredientIndex) => {
        const newIngredients = [...ingredients]; // Clone the ingredients array
    
        // Ensure that allergens field exists and is a string
        if (typeof newIngredients[ingredientIndex].allergens !== 'string') {
            newIngredients[ingredientIndex].allergens = '';
        }
    
        // Append ",''" to the allergens string for the specified ingredient
        newIngredients[ingredientIndex].allergens += ","; // Append ",''" to the allergens field
        setIngredients(newIngredients); // Update the state with the new ingredients array
        console.log(ingredients[ingredientIndex].allergens);
    };
    
    
    const removeAllergen = (ingredientIndex, allergenIndex) => {
        console.log(ingredientIndex, allergenIndex); // Debugging: Log indices
    
        const newIngredients = ingredients.map((ingredient, index) => {
            if (index === ingredientIndex) {
                let allergensArray = ingredient.allergens.split(',');
                allergensArray.splice(allergenIndex, 1); // Remove the specified allergen
                let updatedAllergens = allergensArray.join(','); // Rejoin the remaining allergens
    
                return { ...ingredient, allergens: updatedAllergens }; // Return updated ingredient
            } else {
                return ingredient; // Return other ingredients unchanged
            }
        });
    
        setIngredients(newIngredients); // Update the state with the new ingredients array
        console.log(newIngredients[ingredientIndex].allergens); // Debugging: Log updated allergens
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        let invalid = false;
        switch (progress) {
            case 1:
                // no validation needed
                break;
            case 2:
                // no validation needed
                break;
            case 3:
            // no validation needed
            break;
            case 4:
                // Validate Dish Info
            invalid = mainInfoValidation(dishName, setDishName) || invalid;
            invalid = mainInfoValidation(price, setPrice) || invalid;
            invalid = mainInfoValidation(type, setType) || invalid;
            // Consider adding validation for dishImage if needed

            // Validate each ingredient
            ingredients.forEach((ingredient, index) => {
                invalid = mainInfoValidation(ingredient, (newVal) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = { ...newIngredients[index], ...newVal };
                    setIngredients(newIngredients);
                }) || invalid;
                
                // Add more sspecific validation logic for brandname, link, allergens, etc.
                invalid = linkValidation(ingredient.link, setIngredients) || invalid;
                invalid = allergenValidation(ingredient.allergens, setIngredients) || invalid;
            });
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

            if (id) {
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
                </Container>
            );
            break;
        case 2:
            componentToRender = (
                <Container fluid>
                </Container>
            );
            break;
        case 3:
        componentToRender = (
            <Container fluid>
            </Container>
        );
        break;
        case 4:
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
                        <Form.Group className="mb-3">
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
                                <Form.Select 
                                isInvalid={type.invalid} 
                                onChange={(event) => mainInfoValidation({ text: event.target.value, invalid: type.invalid }, setType)}
                                value={type.text} // Set the default value here
                            >
                                <option value="">Choose Category</option>
                                <option value="desserts">Desserts</option>
                                <option value="drinks">Drinks</option>
                                <option value="hamburger">Hamburger</option>
                                <option value="pasta">Pasta</option>
                                <option value="pizza">Pizza</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid" style={{ position: 'absolute', top: '100%', left: 0 }}>
                                Please choose a category
                            </Form.Control.Feedback>
                            </div>
                            <div style={{ marginBottom: '5%' }}>
                                        <Form.Group className="mb-3" >
                                            <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Dish Image</Form.Label>
                                            <ImageViewer width={"187.92px"} height={"187.92px"} image={dishImage} setImage={setDishImage} fileName={fileNameDish} setFileName={setFileNameDish} />
                                        </Form.Group>
                                    </div>
                        </Form.Group>

                        <Form.Group className="mb-3" style={{borderTop: "4px solid black"}}>
                            <Form.Label style={{ fontSize: 'large', fontWeight: 'bold', paddingTop: 16 }}>List of Ingredients </Form.Label>
                            {ingredients.map((ingredient, index) => (
                                <div key={index} style={{ paddingBottom: 30, borderBottom: "4px solid lightgray"}}>
                                    <Form.Label style={{ fontSize: 'medium', fontWeight: 'bold', marginBottom: 20 }}>Ingredient {index+1}</Form.Label>
                                    <div className="ingredient-item" style={{ marginBottom: '5%' }}>
                                        <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder={`Ingredient ${index + 1}`}
                                        isInvalid={ingredient.invalid} onChange={(event) => mainInfoValidation({ [ingredient.name]: event.target.value, invalid: ingredient.invalid }, setIngredients)}
                                        defaultValue={ingredient.name}
                                        />
                                        <Form.Control.Feedback type="invalid">Please insert at least one ingredient</Form.Control.Feedback>
                                            
                                        <Form.Control
                                        type="text"
                                        name="brandname"
                                        placeholder="Brand Name"
                                        isInvalid={ingredient.invalid} onChange={(event) => mainInfoValidation({ [ingredient.brandname]: event.target.value, invalid: ingredient.invalid }, setIngredients)}
                                        defaultValue={ingredient.brandname}
                                        />
                                        <Form.Control.Feedback type="invalid">Please insert at least one ingredient</Form.Control.Feedback>
                                    </div>
                                    <div style={{ marginBottom: '5%' }}>
                                        <Form.Control
                                        type="text"
                                        name="link"
                                        placeholder="Link"
                                        isInvalid={ingredient.invalid} onChange={(event) => linkValidation({ [ingredient.brandlink]: event.target.value, invalid: ingredient.invalid }, setIngredients)}
                                        defaultValue={ingredient.brandlink}
                                        />
                                        <Form.Control.Feedback type="invalid">Please insert at least one ingredient</Form.Control.Feedback>
                                    </div>
                                    {((ingredient.allergens).split(',')).map((allergen, inner_index) => (
                                        <div key={`${index}-${inner_index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <div style={{ marginBottom: '5%', flex: 6, marginRight: '8px' }}>
                                                <Form.Control
                                                type="text"
                                                name="allergenslist"
                                                placeholder={`Allergen ${inner_index + 1}`}
                                                isInvalid={ingredient.invalid} 
                                                onChange={(event) => handleAllergenChange(index, inner_index, event.target.value)}
                                                defaultValue={allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                                                />
                                                <Form.Control.Feedback type="invalid">Please insert at least one ingredient</Form.Control.Feedback>
                                            </div>
                                            <div style={{ marginBottom: '5%', flex: 3 }}>
                                            <Button size='sm' variant="success" onClick={() => addAllergen(ingredient, index)} style={{ marginRight: "2%" }}><i className="bi bi-plus-lg"></i></Button>
                                            {((ingredient.allergens).split(',').length > 1) ? <Button size='sm' variant="danger" onClick={() => removeAllergen(index, inner_index)}><i className="bi bi-trash"></i></Button> : ''}
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ marginBottom: '5%' }}>
                                        <Form.Group className="mb-3" >
                                            <Form.Label style={{ fontSize: 'medium', fontWeight: 'bold' }}>Ingredient {index+1} Image</Form.Label>
                                            <ImageViewer width={"100px"} height={"100px"} image={ingredientImage[index]} setImage={setIngredientImage} fileName={fileNameIngredient} setFileName={setFileNameIngredient} />
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
                <Container fluid style={{ height: '78vh', overflowY: 'auto', marginBottom:'3%' }}>
                    {componentToRender}
                </Container>
                <Container className="d-flex justify-content-between mt-auto">
                    {(progress > 1) ? <Button variant="warning" onClick={() => { navigate(`/editInfo/${id}`,{ state: { from: 'add_or_edit_dish' }}) }}>Back</Button> : ''}
                    {(progress < 4) ? <Button variant="primary" type='submit' className="ms-auto">Next</Button> : <Button variant="primary" type='submit' className="ms-auto">Add Dish</Button>}
                    {(progress === 4 && dishes.length !== 0) ? <Button variant="primary" type='submit' className="ms-auto">Save</Button> : ''}
                </Container>
            </Form>
        </>
    );
}

function DishForm(props) {
    const [progress, setProgress] = useState(4);

    return (
        <>
            <ProgressLabel progress={progress} />
            <InnerForm progress={progress} setProgress={setProgress} />
        </>
    );
}
export { DishForm };
