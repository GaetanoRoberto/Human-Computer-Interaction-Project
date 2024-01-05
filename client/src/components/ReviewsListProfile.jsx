import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Card, Col, Row, Button, FormControl } from 'react-bootstrap';
import { Header } from './Header';
import { NavigationButtons } from './NavigationButtons';
import { SearchBar } from './Home';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import dayjs from 'dayjs';
import ConfirmModal from './ConfirmModal';


function ReviewsListProfile(props) {
    const [showModal, setShowModal] = useState(false);
    const [indexOfTheReviewToRemove, setIndexOfTheReviewToRemove] = useState(0);
    const navigate = useNavigate();

    const handleRemoveReview = (index) => {
        console.log(index);
        setShowModal(true);
        setIndexOfTheReviewToRemove(index);
    };

    const removeReview = (index) => {
        console.log(index);
        const newReviews = props.reviews.filter((_, i) => i !== index);
        props.setReviews(newReviews);
    };

    return (
        <>
            {props.numberOfReviews == 1 ? <h2>You have done {props.numberOfReviews} review</h2> : <h2>You have done {props.numberOfReviews} reviews</h2>}
            <ListGroup>
                {props.reviews.sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day")).map((item, index)  => {
                    return (
                        <Card key={index} onClick={() => { navigate(`/restaurants/${item.restaurantId}/reviews/edit/${item.id}`) }}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>Restaurant id: {item.restaurantId}</Card.Title>
                                    </Col>
                                    <Col>
                                        <Card.Text>
                                            {
                                                Array.from({ length: item.quality }, (_, index) => (
                                                    <i key={index} className="bi bi-star-fill"></i>
                                                ))
                                            }
                                        </Card.Text>
                                        <Card.Text>
                                            {
                                                Array.from({ length: item.price }, (_, index) => (
                                                    <i key={index} className="bi bi-currency-euro"></i>
                                                ))
                                            }
                                        </Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Card.Text>
                                        {item.title}
                                    </Card.Text>
                                </Row>
                                <Row>
                                    <Card.Text>
                                        {item.description}
                                    </Card.Text>
                                </Row>
                                <Row>
                                    <Card.Text>
                                        {item.date}
                                    </Card.Text>
                                </Row>
                                {/* {(props.numberOfReviews >= 1) ? 
                                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', zIndex: 1}}>
                                    <Button size='sm' variant="warning" onClick={() => { navigate(`/restaurants/${item.restaurantId}/reviews/edit/${item.id}`) }} style={{marginRight: '10px', color: 'white'}}><i className="bi bi-pencil-square"></i></Button> 
                                    <Button size='sm' variant="danger" onClick={() => handleRemoveReview(index)}><i className="bi bi-trash"></i></Button> 
                                </div>
                                : ''} */}
                            </Card.Body>
                        </Card>
                    );
                })}
                    <ConfirmModal text={'Delete this Review'} show={showModal} setShow={setShowModal} action={removeReview} parameter={indexOfTheReviewToRemove}/>
            </ListGroup>
        </>
    );
}


export { ReviewsListProfile };