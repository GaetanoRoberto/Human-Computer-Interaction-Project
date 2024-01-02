import { useNavigate } from 'react-router-dom'
import { Col, Button } from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import menuImage from "../restaurantPng/menu.png";

const NavigationButtons = (props) => {
    const navigate = useNavigate();

    return (
        <Col className='fixed-position'>
            <Button active={props.details} variant="success" size="lg" className="sharp-border" onClick={() => {props.setDetails(true); props.setMenu(false); props.setReviews(false); navigate(`/restaurants/${props.id}/details`)}}><FontAwesomeIcon icon="fa-solid fa-circle-info" size="sm" /> Details </Button>
            <Button active={props.menu} variant="success" size="lg" className="sharp-border" onClick={() => {props.setMenu(true); props.setDetails(false); props.setReviews(false); navigate(`/restaurants/${props.id}/menu`)}}><img style={{marginBottom: "0.4rem", marginRight: "0.2rem"}} width="24px" height="24px" src={menuImage}/>Menu </Button>
            <Button active={props.reviews} variant="success" size="lg" className="sharp-border" onClick={() => {props.setReviews(true); props.setMenu(false); props.setDetails(false);  navigate(`/restaurants/${props.id}/reviews`)}}><FontAwesomeIcon icon="fa-solid fa-ranking-star" size="xs" /> Review </Button>
        </Col>
    );
}

export { NavigationButtons };
