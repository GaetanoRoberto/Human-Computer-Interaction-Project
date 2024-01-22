import { useState, useEffect } from 'react';
import { Button, Container, Form, ListGroup, Col, Row } from 'react-bootstrap';
import { PLACEHOLDER } from './Costants';
import dayjs from 'dayjs';
import validator from 'validator';
import 'react-phone-number-input/style.css'
import { ImageViewer, DishItem, AddressSelector, address_string_to_object, address_object_to_string, time_object_to_string, sort_and_merge_times, time_string_to_object } from './RestaurantFormUtility';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { foodAllergens } from './Costants';

const animatedComponents = makeAnimated();

function DishForm(props) {
    
    //const [restaurant,setRestaurant] = useState({});
    //const [dishes, setDishes] = useState([]);
    const {
        dish,
        dishName,
        setDishName,
        price,
        setPrice,
        type,
        setType,
        dishImage,
        setDishImage,
        fileNameDish,
        setFileNameDish,
        ingredients,
        setIngredients,
        ingredientTempId,
        setIngredientTempId,
        ingredientImage,
        setIngredientImage,
        fileNameIngredient,
        setFileNameIngredient,
        mainInfoDishValidation,
        priceValidation,
        ingredientLinkValidation,
        allergen_validation,
    } = props;

    // to retrieve info of the restaurant if in edit
    useEffect(() => {
        // function used to retrieve restaurant information in detail
        async function populateDish(dish) {
            // Now, dish contains the dish object with the matching id
            if (dish) {
                // You can access dish properties and use them in your component
                // set info of the dish
                
                setDishName({ text: dish.name, invalid: false });
                setPrice({ price: dish.price, invalid: false });
                setType({ text: dish.type, invalid: false });
                setDishImage(dish.image);
                //setFileNameDish({ text: dish.name, invalid: false });
                //setIngredients([{, name: '', allergens: [''], brandname: '', link: '', invalid: false }  ]);
                // Fill the ingredients state based on dish.ingredients
                const updatedIngredients = dish.ingredients.map(ingredient => ({
                    id: ingredient.id, // Assuming id is unique for each ingredient
                    text: ingredient.name || '',
                    allergens: ingredient.allergens,
                    brandname: ingredient.brandName || '',
                    link: ingredient.link || '',
                    invalid_text: false,
                    invalid_allergens: false,
                    invalid_brandname: false,
                    invalid_link: false
                }));

                if (dish.ingredients.length == 0) {
                    // check on dish.type instead of type.text since state update is asynchronous
                    if (dish.type!=='drinks') {
                        setIngredients([{ id: 0, text: '', allergens: null, brandname: '', link: '', invalid_text: false, invalid_allergens: false, invalid_brandname: false, invalid_link: false }]);
                    } else {
                        setIngredients([]);
                    }
                } else {
                    setIngredients(updatedIngredients);
                }

                // Fill the ingredientImage state with placeholders or actual images if available
                const updatedIngredientImages = dish.ingredients.map((ingredient, index) => {
                    // Assuming you have an 'image' property for each ingredient
                    return ingredient.image || PLACEHOLDER;
                });

                if (dish.ingredients.length == 0) {
                    setIngredientImage([PLACEHOLDER]);
                } else {
                    setIngredientImage(updatedIngredientImages);
                }

            } else {
                // Handle the case when the dish with dishId is not found
                console.log('Dish not found');
            }
        };
        if (dish) {
            populateDish(dish);
        }
    }, []);

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            { id: ingredientTempId, text: '', allergens: null, brandname: '', link: '', invalid_text: false, invalid_allergens: false, invalid_brandname: false, invalid_link: false }
        ]);
        setIngredientImage([
            ...ingredientImage,
            PLACEHOLDER
        ]);
        setIngredientTempId((old_id) => old_id + 1);
    };

    const removeIngredient = (ingredient_id) => {
        const newIngredients = ingredients.filter((item) => item.id !== ingredient_id);
        setIngredients(newIngredients);
    };

    const addAllergen = (outer_id, selected_allergens) => {
        let validation_ingredient = {};
        const newIngredients = ingredients.map((ingredient) => {
            if (outer_id === ingredient.id) {
                // ingredient to edit the allergens
                validation_ingredient = { ...ingredient, allergens: selected_allergens.map((allergen) => allergen.value).join(',') };
                return { ...ingredient, allergens: selected_allergens.map((allergen) => allergen.value).join(',') }
            } else {
                validation_ingredient = ingredient;
                return ingredient;
            }
        });
        setIngredients(newIngredients); // Update the state with the new ingredients array
        allergen_validation(validation_ingredient);
    };

    return (
        <>
            <Container fluid style={{ height: '70vh', overflowY: 'auto', marginBottom: '3%' }}>
                <Form.Group >
                    <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Dish Info</Form.Label>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control required isInvalid={dishName.invalid} type="text" placeholder="Dish Name" defaultValue={dishName.text}
                                onChange={(event) => mainInfoDishValidation({ text: event.target.value.trim(), invalid: dishName.invalid }, setDishName, false)} />
                            <Form.Control.Feedback type="invalid" >Choose a Name</Form.Control.Feedback>
                        </Col>

                        <Col>
                            <Form.Control required isInvalid={price.invalid} type="number" placeholder="Price (€)" value={price.price}
                                onInput={(event) => priceValidation({ price: event.target.value.trim(), invalid: price.invalid })} />
                            <Form.Control.Feedback type="invalid" >Insert a Valid Price</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Select required isInvalid={type.invalid} value={type.text}
                                onChange={(event) => mainInfoDishValidation({ text: event.target.value, invalid: type.invalid }, setType, false)}>
                                <option value="">Choose Category</option>
                                <option value="desserts">Desserts</option>
                                <option value="drinks">Drinks</option>
                                <option value="hamburger">Hamburger</option>
                                <option value="pasta">Pasta</option>
                                <option value="pizza">Pizza</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid" >
                                Choose a category
                            </Form.Control.Feedback>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" >
                        <Form.Label style={{ fontSize: 'large', fontWeight: 'bold' }}>Dish Image</Form.Label>
                        <ImageViewer width={"200px"} height={"200px"} image={dishImage} setImage={setDishImage} fileName={fileNameDish} setFileName={setFileNameDish} />
                    </Form.Group>
                </Form.Group>

                <Form.Group className="mb-3" style={{ borderTop: "4px solid black" }}>
                    <Form.Label style={{ fontSize: 'large', fontWeight: 'bold', paddingTop: 16 }}>List of Ingredients </Form.Label>
                    {ingredients.map((ingredient, index) => (
                        <div key={ingredient.id} style={{ paddingBottom: 30, borderBottom: "4px solid lightgray", marginTop: "2%" }}>
                            <Form.Label style={{ fontSize: 'medium', fontWeight: 'bold', marginBottom: 20, paddingRight: '5%' }}>Ingredient {index + 1}</Form.Label>
                            {(ingredients.length > 1 || type.text==='drinks') ? <Button size='sm' variant="danger" onClick={() => removeIngredient(ingredient.id)}><i className="bi bi-trash"></i></Button> : ''}
                            <Row style={{ marginBottom: '5%' }}>
                                <Col>
                                    <Form.Control
                                        required
                                        type="text"
                                        name="name"
                                        placeholder={`Ingredient ${index + 1}`}
                                        isInvalid={ingredient.invalid_text}
                                        onChange={(event) => mainInfoDishValidation({ ...ingredient, text: event.target.value.trim() }, setIngredients, 'text')}
                                        defaultValue={ingredient.text}
                                    />
                                    <Form.Control.Feedback type="invalid">Insert The Ingredient Name</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control
                                        required
                                        type="text"
                                        name="brandname"
                                        placeholder="Brand Name"
                                        isInvalid={ingredient.invalid_brandname}
                                        onChange={(event) => mainInfoDishValidation({ ...ingredient, brandname: event.target.value.trim() }, setIngredients, 'brandname')}
                                        defaultValue={ingredient.brandname}
                                    />
                                    <Form.Control.Feedback type="invalid">Insert The Ingredient Brand Name</Form.Control.Feedback>
                                </Col>
                            </Row>
                            <div style={{ marginBottom: '5%' }}>
                                <Form.Control
                                    type="text"
                                    name="link"
                                    placeholder="Link"
                                    isInvalid={ingredient.invalid_link}
                                    onChange={(event) => {
                                        setIngredients((oldIngredients) => oldIngredients.map((oldingredient) => {
                                            if (oldingredient.id === ingredient.id) {
                                                return { ...oldingredient, link: event.target.value.trim(), invalid_link: (event.target.value.length === 0) ? false : ingredient.invalid_link };
                                            }
                                            return oldingredient;
                                        }))
                                    }}
                                    defaultValue={ingredient.link}
                                />
                                <Form.Control.Feedback type="invalid">Insert A Valid Ingredient Link</Form.Control.Feedback>
                            </div>
                            <div style={{ marginBottom: '5%' }}>
                                <CreatableSelect
                                    closeMenuOnSelect={false}
                                    placeholder={`Allergens of Ingredient ${index + 1}`}
                                    components={animatedComponents}
                                    isMulti
                                    isSearchable={true}
                                    isClearable={true}
                                    options={foodAllergens}
                                    value={ingredients.map((ingredient, inner_index) => {
                                        if (inner_index === index && ingredient.allergens) {
                                            return ingredient.allergens.split(',').map(item => ({ value: item.trim(), label: item.trim() }));
                                        }
                                    }).filter((item) => item !== undefined).flat().filter((item) => item.value !== '' && item.label !== '')}
                                    onChange={(event) => addAllergen(ingredient.id, event)}
                                />
                                {(ingredient.invalid_allergens) ? <div className="invalid-feedback" style={{ display: 'block' }}>Remove Empty-Spaces Allergens</div> : ''}
                            </div>
                            <div style={{ marginBottom: '5%' }}>
                                <Form.Group className="mb-3" >
                                    <Form.Label style={{ fontSize: 'medium', fontWeight: 'bold' }}>Ingredient {index + 1} Image</Form.Label>
                                    <ImageViewer width={"150px"} height={"150px"} image={ingredientImage[index]} setImage={setIngredientImage} fileName={fileNameIngredient} setFileName={setFileNameIngredient} />
                                </Form.Group>
                            </div>
                        </div>
                    ))}
                    <Button variant="success" onClick={addIngredient} style={{ marginRight: "2%", marginTop: "2%" }}>Add New Ingredient</Button>
                </Form.Group>
            </Container>
            {/*<Container className="d-flex justify-content-between mt-auto">
                    <Button variant="warning" onClick={() => { navigate(`/editInfo/${id}`, { state: { from: 'add_or_edit_dish' } }) }}>Back</Button>
                    {(dishId) ? <Button variant="primary" type='submit' className="ms-auto">Edit Dish</Button> : <Button variant="primary" type='submit' className="ms-auto">Add Dish</Button> }
                                    </Container>*/}
        </>
    );
}

export { DishForm };
