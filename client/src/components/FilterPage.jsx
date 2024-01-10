import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Fade } from 'react-bootstrap';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const FilterPage = (props) => {
    const { filters, setFilters, isInvalidPrice, setIsInvalidPrice, isInvalidIngredient, setIsInvalidIngredient } = props;
    const [fadeStates, setFadeStates] = useState([]);
    const navigate = useNavigate();

    // Initialize fadeStates array when filters.ingredients change
    useEffect(() => {
        const initialStates = filters.ingredients.map(() => true);
        setFadeStates(initialStates);
    }, [filters.ingredients]);

    const categoriesOptions = [
        { value: 'Chocolate', label: 'Choose Category' },
        { value: 'Desserts', label: 'Desserts' },
        { value: 'Drinks', label: 'Drinks' },
        { value: 'Hamburger', label: 'Hamburger' },
        { value: 'Pasta', label: 'Pasta' },
        { value: 'Pizza', label: 'Pizza' },
    ]

    const ingredientsOptions = [
        { value: 'Tomato', label: 'Tomato' },
        { value: 'Cheese', label: 'Cheese' },
        { value: 'Basil', label: 'Basil' },
        { value: 'Chicken', label: 'Chicken' },
        { value: 'Prova', label: 'Prova' },
        { value: 'Test', label: 'Test' },
        { value: 'Cao', label: 'Cao' },
        { value: 'Ciao', label: 'Ciao' },
    ]

      const handleCategoryChange = (selectedOptions) => {
        setFilters((prevFilter) => ({
          ...prevFilter,
          categories: selectedOptions.map((option) => option.value),
        }));
      };
      
    const handleChange = (e) => {
        const { name, value } = e.target;
      
        // Input validation for minimum and maximum prices
        if (name == 'minprice' || name == 'maxprice') {
          // Ensure the value is a valid number
          const numericValue = parseFloat(value);
          if (isNaN(numericValue) || numericValue < 0) {
            setIsInvalidPrice(true);
            // Handle invalid input, e.g., show an error message
            return;
          }
      
          // Update the state only if the value is valid
          setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: numericValue,
          }));
      
          // If both minimum and maximum prices are set, check if minimum is lower than maximum
          if (name == 'minprice' && filters.maxprice != '' && numericValue >= filters.maxprice) {
            setIsInvalidPrice(true);
            // You can also reset the value to a valid one or prevent further action
            return;
          } else if (name == 'maxprice' && filters.minprice != '' && numericValue <= filters.minprice) {
            setIsInvalidPrice(true);
            // You can also reset the value to a valid one or prevent further action
            return;
          }
        } else {
          // For other inputs, update the state directly
          setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
          }));
          setIsInvalidPrice(false);
        }
      };
      

    const handleOpenNowChange = (e) => {
        setFilters({ ...filters, openNow: e.target.checked });
    };

    const handleIngredientChange = (selectedIngredient) => {
        if (selectedIngredient && !filters.ingredients.includes(selectedIngredient.value)) {
          setFilters((prevFilters) => ({ ...prevFilters, ingredients: [...prevFilters.ingredients, selectedIngredient.value] }));
        }
      };
      

    const handleFadeClick = (index) => {
        setFadeStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = false;
            return newStates;
        });
    
        setTimeout(() => {
            // Remove the ingredient from the array after the fade-out animation
            setFilters((prevFilters) => {
                const newIngredients = [...prevFilters.ingredients];
                newIngredients.splice(index, 1);
                return { ...prevFilters, ingredients: newIngredients };
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
        console.log(filters);
        // Add logic to filter the food items
    };

    return (
        <>
            <Header selectedStatus={props.selectedStatus} setSelectedStatus={props.setSelectedStatus}/>
            <Container fluid>
                <Row>
                    <Col>
                        <h2 style={{marginTop: "3%"}}>Filter by:</h2>
                        <ToggleButton
                        id="toggle-check"
                        type="checkbox"
                        variant="outline-primary"
                        checked={filters.openNow}
                        value="1"
                        onChange={(e) => handleOpenNowChange(e)}
                        style={{paddingLeft: "2rem", paddingRight: "2rem", borderRadius: 0, marginTop: "2.5%",marginBottom: "3.5%"}} 
                        >
                        Open Now
                        </ToggleButton>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={3} style={{marginTop: "2.5%",marginBottom: "3.5%"}}>
                                    <Form.Group controlId="formBasicCategory" style={{fontSize:"1rem"}}>
                                        <Form.Label>Category</Form.Label>
                                        <Select
                                        closeMenuOnSelect={false}
                                        placeholder="Choose Category"
                                        components={animatedComponents}
                                        isMulti
                                        isSearchable={false}
                                        isClearable={true}
                                        options={categoriesOptions}
                                        value={categoriesOptions.filter((option) => filters.categories.includes(option.value))}
                                        onChange={handleCategoryChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} style={{marginTop: "2.5%",marginBottom: "3.5%"}}> 
                                    <Row>
                                        <Form.Group as={Col} controlId="formMinPrice">
                                            <Form.Label>Minimum Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="minprice" // ensure the name matches the state property
                                                placeholder="Min (€)"
                                                value={filters.minprice}
                                                onChange={(e) => handleChange({ target: { name: 'minprice', value: e.target.value } })}
                                                />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formMaxPrice">
                                            <Form.Label>Maximum Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="maxprice" // ensure the name matches the state property
                                                placeholder="Max (€)"
                                                value={filters.maxprice}
                                                onChange={(e) => handleChange({ target: { name: 'maxprice', value: e.target.value } })}
                                            />
                                        </Form.Group>
                                    </Row>
                                    {isInvalidPrice ? (
                                                <div style={{ height: "2rem", overflow: "hidden",  position: 'relative' }}>
                                                    <p style={{  position: 'absolute', marginTop: "0.25rem", fontSize: "0.875em", color: "var(--bs-form-invalid-color)", fontFamily: "var(--bs-body-font-family)" }}>
                                                        Please Enter a Valid Range of Price.
                                                    </p>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                </Col>
                                <Col md={3} style={{marginTop: "2.5%",marginBottom: "3.5%"}}>
                                    <Form.Group controlId="formMaxDistance">
                                        <Form.Label>Max Distance</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="maxDistance" 
                                            placeholder="Max Distance (km)"
                                            value={filters.maxDistance}
                                            onChange={(e) => handleChange({ target: { name: 'maxDistance', value: e.target.value } })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} style={{marginTop: "2.5%",marginBottom: "3.5%"}}> 
                                    <Row>
                                        <Form.Group as={Col} controlId="formBasicQualityRating">
                                            <Form.Label>Quality Rating</Form.Label>
                                            <Form.Select 
                                                name="qualityRating"  // This should match the key in your state
                                                onChange={(e) => handleChange({ target: { name: 'qualityRating', value: e.target.value } })}
                                                value={filters.qualityRating}  // Set the value from state
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
                                                value={filters.safetyRating}  // Set the value from state
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
                                {/* <Col md={3} style={{marginTop: "3%", marginBottom: "4%"}}>
                                    <Form.Group controlId="formBasicPriceRating">
                                        <Form.Label>Price Rating</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="priceRating"
                                            value={filters.priceRating}
                                            onChange={handleChange}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="4">4 Stars & above</option>
                                            <option value="3">3 Stars & above</option>
                                            <option value="2">2 Stars & above</option>
                                        </Form.Control>
                                    </Form.Group> 
                                </Col> */}
                                <Col md={3} style={{marginTop: "2.5%",marginBottom: "3.5%"}}>
                                    <Form.Group className='mb-3' controlId="formBasicIngredient">
                                        <Form.Label>Ingredient</Form.Label>
                                        <Row>
                                        <Col>
                                        <Select
                                        placeholder="Type an ingredient"
                                        isClearable={true}
                                        isSearchable={true}
                                        options={ingredientsOptions}
                                        onChange={handleIngredientChange}
                                        />
                                            {isInvalidIngredient ? (
                                                <div style={{ height: "2rem", overflow: "hidden",  position: 'relative' }}>
                                                    <p style={{  position: 'absolute', marginTop: "0.25rem", fontSize: "0.875em", color: "var(--bs-form-invalid-color)", fontFamily: "var(--bs-body-font-family)" }}>
                                                        Please Enter a Valid Ingredient.
                                                    </p>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </Col>
                                        <Col xs="auto">
                                            <Button
                                                variant="primary"
                                                style={{ marginLeft: '-12%' }}
                                            >
                                                <i className="bi bi-plus-lg"></i>
                                            </Button>
                                        </Col>
                                        <Container fluid className="scroll" style={{ marginTop: "0.6rem", display: "flex", overflowX: "auto"}}>
                                            {filters.ingredients.map((ingredient, index) => (
                                                <h2 key={index}>
                                                    <Fade in={fadeStates[index]}>
                                                        <Button active style={{ marginRight: "0.4rem", borderRadius: "10px", backgroundColor: "#52b69a", borderColor: "#52b69a", whiteSpace: "nowrap" }}>
                                                            {ingredient}
                                                            <span style={{ marginLeft: "0.7rem", display: "inline-block" }} onClick={() => handleFadeClick(index)}>
                                                                <FontAwesomeIcon icon="fa-solid fa-xmark" />
                                                            </span>
                                                        </Button>
                                                    </Fade>
                                                </h2>
                                            ))}
                                        </Container>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Col style={{
                                position: "fixed",  // Fixed position
                                bottom: "3.5%",       // 5% from the bottom of the viewport
                                left: "50%",        // Initially, put it halfway across the screen
                                transform: "translateX(-50%)",  // Adjust horizontally to truly center it
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Button variant="primary" style={{fontSize: "1.4rem", padding: "1rem"}} 
                                    onClick={(e) => {if (isInvalidIngredient) {
                                                        // Prevent default behavior
                                                        e.preventDefault();
                                                    } else {
                                                        navigate(`/`);
                                                    }
                                                }}> 
                                    Show results
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
