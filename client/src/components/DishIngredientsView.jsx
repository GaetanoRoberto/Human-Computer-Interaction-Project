import {Badge, Button, Col, Container, Image, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {ErrorContext} from "./userContext.jsx";
import API from "../API.jsx";


function DishIngredientsView(){
    const { dishId } = useParams();
    const handleError = useContext(ErrorContext);
    const [dish, setDish] = useState(null);

    useEffect(() => {
        const getDish = async () => {
            try {
                const dish = await API.getDish(dishId);
                setDish(dish);
            } catch (error) {
                handleError(error);
            }
        }

        getDish();
    }, [dishId]);


    return(
        <>
            { dish && (
                <Container fluid style={{maxHeight: window.innerHeight - 55, overflowY: "scroll"}}>
                    <Image style={{marginTop: "0.4rem"}} src={dish.image} fluid />
                    <div style={{borderTop: "1px solid #D3D3D3", margin: 0, marginBottom: "0.4rem", marginTop: "0.4rem"}}></div>
                    <h1 style={{textAlign: "center"}}>
                        {dish.name}
                    </h1>
                    <Row>
                        <Col as={"h2"} style={{textAlign: "center"}}>
                            <Badge pill bg="success"> {dish.type} </Badge>
                        </Col>
                    </Row>
                    <Row>
                        <Col as={"h1"} style={{textAlign: "center", marginLeft: "0.4rem", marginTop: "0.4rem"}}>
                            <i><b>{dish.price}<i className="bi bi-currency-euro"></i></b></i>
                        </Col>
                    </Row>
                    {dish.ingredients.length !== 0 ?
                        <h2 style={{textAlign: "center", marginTop: "2rem", marginBottom: "0.4rem"}}>
                            Ingredients
                        </h2>
                        :
                        <></>
                    }
                    {
                        dish.ingredients.map((ingredient, index) => {
                            let allergens = [];

                            if(ingredient.allergens !== null)
                                allergens = ingredient.allergens.split(',').map(allergen => allergen.trim());

                            return (
                                <div key={index}>
                                    <div style={{borderTop: "1px solid #D3D3D3", margin: 0}} ></div>
                                    <Row>
                                        <Col as={"h4"} style={{marginTop: "1.4rem"}}>
                                            <i>{ingredient.name}</i>
                                        </Col>
                                    </Row>
                                    <Row style={{marginBottom: "1.4rem"}}>
                                        <Col>
                                            { allergens.length === 0 ?
                                                <h6 style={{marginTop: "1rem"}}> No allergens </h6>
                                                :
                                                allergens.map((allergen, index) => (
                                                    <h5 key={index} style={{marginTop: "0.4rem"}}>
                                                        <Badge style={{borderRadius: 20}} bg={ allergen === "lactose" ? "info" : allergen === "pork" ? "secondary" : allergen === "gluten" ? "danger" : "primary"}>
                                                            { allergen === "gluten" ?
                                                                <>
                                                                    <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" /> {allergen}
                                                                </>
                                                                :
                                                                allergen
                                                            }
                                                        </Badge>
                                                    </h5>
                                                ))
                                            }
                                            { ingredient.brandLink === null ?
                                                <h5 style={{marginTop: "3rem"}}>
                                                    {ingredient.brandName}
                                                </h5>
                                                :
                                                <>
                                                    <h6 style={{marginTop: "3rem"}}>
                                                        Brand :
                                                    </h6>
                                                    <Button variant="light" size="lg" className="custom-link-button" href={ingredient.brandLink} target={"_blank"}> {ingredient.brandName} </Button>
                                                </>
                                            }
                                        </Col>
                                        <Col style={{textAlign: "end"}}>
                                            <img height={"130px"} width={"130px"} src={ingredient.image} />
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })
                    }
                </Container>
            )}
        </>
    );
}

export { DishIngredientsView };