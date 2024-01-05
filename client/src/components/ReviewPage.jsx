import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import { ButtonGroup, Form, Button, Alert, Row, Col, Image, Container } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Header } from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from './userContext';
import ConfirmModal from './ConfirmModal';
import API from '../API';


const addReview = (review) => {
  API.createReview(review)
    .then(() => { })
    .catch(e => console.log(e));
}
const editReview = (review) => {
  API.updateReview(review)
    .then(() => {  })
    .catch(e => console.log(e));
}
const deleteReview = (review) => {
  API.deleteReview(review)
    .then(() => {  })
    .catch(e => console.log(e));
}
/*
  const handleHappinessClick = (happinessIndex) => {
    setSelectedHappiness(happinessIndex);
  };
  const handleEuros = (value) => {
    setEuros(value);
  };
  */

const ReviewForm = (props) => {
  const user = useContext(UserContext);


  // reviewId da URL
  const { id, reviewId } = useParams();
  const location = useLocation();
  // location.pathname = /reviews/:id of view or /edit/:id or /add
  const view = location.pathname === `/restaurants/${id}/reviews/${reviewId}`
  //console.log(view, id, user && user.username)
  // info pagina
  const [username, setUsername] = useState(user && user.username ? user.username : " ");
  const [date, setDate] = useState(dayjs());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quality, setQuality] = useState(0);
  const [safety, setSafety] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  const [qualityValid, setQualityValid] = useState(true);
  const [safetyValid, setSafetyValid] = useState(true);
  const [euroValid, setEuroValid] = useState(true);

  const [show,setShow] =  useState(false);
  // USE EFFECT 

  useEffect(() => {
    if (reviewId) {// se non sono in add prendo i dati della revie dal server  
      API.getReview(reviewId)
        .then((review) => {
          setTitle(review.title);
          setUsername(review.username),
          setDate(review.date)
          setDescription(review.description)
          setQuality(review.quality)
          setSafety(review.safety)
          setPrice(review.price)
        }
        )
        .catch((err) => console.log(err));
    }
  }, []);


  function Rating(props) {
    const [starsSelected, setStarsSelected] = useState(props.quality);
    return [...Array(5)].map((el, index) =>
      <i onClick={
        props.view
          ? null
          : () => {
            setStarsSelected(index + 1);
            setQualityValid(true);
            setQuality(index + 1); // Aggiorna quality con il valore cliccato
          }
      } key={index}
        className={(index < starsSelected) ? "bi bi-star-fill " : "bi bi-star"}
        style={{
          color: '#FFD700', marginRight: "5px",
          fontSize: "2em"
        }} />
    );
  }
  function Prices(props) {
    const [euros, setEuros] = useState(props.price);
    return [...Array(5)].map((el, index) =>
      <i onClick={
        props.view
          ? null
          : () => {
            setEuros(index + 1);
            setEuroValid(true);
            setPrice(index + 1); // Aggiorna quality con il valore cliccato
          }}
        key={index}
        className={"bi bi-currency-euro"}
        style={{
          color: (index < euros) ? "#000" : "#DCDCDC", marginRight: "5px",
          fontSize: "2em"
        }} />
    );
  }
  function HappinessRating(props) {
    const [selectedHappiness, setSelectedHappiness] = useState(props.safety);
    return [...Array(5)].map((el, index) =>
      <FontAwesomeIcon
        key={index}
        onClick={
          props.view
            ? null
            : () => {
              setSelectedHappiness(index + 1);
              setSafetyValid(true);
              setSafety(index + 1); // Aggiorna quality con il valore cliccato
            }}
        icon={(index + 1 != selectedHappiness) ? getHappinessClass(index) : getHappinessSolidClass(index)}
        style={{
          color: (index < 5) ? getHappinessColor(index) : "", marginRight: "5px",
          fontSize: "2em"
        }} />
    );
  }
  function getHappinessClass(index) {
    switch (index) {
      case 0:
        return "fa-regular fa-face-dizzy";
      case 1:
        return "fa-regular fa-face-tired";
      case 2:
        return "fa-regular fa-face-meh";
      case 3:
        return "fa-regular fa-face-smile";
      case 4:
        return "fa-regular fa-face-grin-stars";
      default:
        return " ";
    }
  }
  function getHappinessSolidClass(index) {
    switch (index) {
      case 0:
        return "fa-solid fa-face-dizzy";
      case 1:
        return "fa-solid fa-face-tired";
      case 2:
        return "fa-solid fa-face-meh";
      case 3:
        return "fa-solid fa-face-smile";
      case 4:
        return "fa-solid fa-face-grin-stars";
      default:
        return " ";
    }
  }
  function getHappinessColor(index) {
    switch (index) {
      case 0:
        return "#ff3300" // Faccina arrabbiata
      case 1:
        return "#ff8300"; // Faccina triste
      case 2:
        return "#FFD700"; // Faccina neutra
      case 3:
        return "#00ff5b"; // Faccina sorridente
      case 4:
        return "green"; // Faccina che ride
      default:
        return " ";
    }
  }
  function handleSubmit(event) {
    let valid = true;
    event.preventDefault();//non invio subito dati del form
    event.stopPropagation();

    // Form validation
    if (quality == 0){
      setQualityValid(false);
      valid = false;
    }
    if (safety == 0){
      setSafetyValid(false);
      valid = false;

    }
    if (price == 0){
      setEuroValid(false);
      valid = false;
    }

    if(valid){
      const review = {
        username : username,
        restaurantId : id,
        date : dayjs(date).format("YYYY-MM-DD"),
        title : title,
        description : description,
        quality : quality,
        safety:safety,
        price : price
      }
      if (reviewId) {  // per vedere se sono in add o in edit
        review.id = reviewId;//url
        editReview(review);
      } else {
        addReview(review);
      }
 
      navigate(`/restaurants/${id}/reviews`);
    }

  }

  return (
    <>
      <Header />
      <Container>
        <Form noValidate onSubmit={handleSubmit}>
          <Row>
            <Col lg={true}  >
              <Form.Label>Username</Form.Label>
              <Form.Control disabled readOnly type="text" name="username" value={username} />
            </Col>
            <Col lg={true} >
              <Form.Label>Date</Form.Label>
              <Form.Control disabled readOnly type="date" name="date" value={dayjs(date).format("YYYY-MM-DD")} />
            </Col>
          </Row>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" isInvalid={title === '' || title.trim().length === 0} disabled={view} required name="title" value={title} onChange={ev => setTitle(ev.target.value)} />
            <Form.Control.Feedback type="invalid">Please choose a Title.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" isInvalid={description === '' || description.trim().length === 0} required disabled={view} rows={3} name="description" value={description} onChange={ev => setDescription(ev.target.value)} />
            <Form.Control.Feedback type="invalid">Please choose a Description.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formQuality">
            <Row>
              <Col xs={3} className="d-flex align-items-center justify-content-start">
                <Form.Label className="me-5">Quality</Form.Label>
              </Col>
              <Col xs={6} className="d-flex align-items-center">
                <Rating view={view} quality={quality} />
              </Col>
            </Row>
            <Row>
              <Form.Text hidden={qualityValid} className="text-danger">Please select a Quality Value.</Form.Text>
            </Row>
          </Form.Group>

          <Form.Group controlId="formSafety">
            <Row>
              <Col xs={3} className="d-flex align-items-center justify-content-start">
                <Form.Label className="me-5">Safety</Form.Label>
              </Col>
              <Col xs={6} className="d-flex align-items-center">
                <HappinessRating view={view} safety={safety} />
              </Col>
            </Row>
            <Row>
              <Form.Text hidden={safetyValid} className="text-danger">Please select a Safety Value.</Form.Text>
            </Row>
          </Form.Group>

          <Form.Group controlId="formPrice">
            <Row>
              <Col xs={3} className="d-flex align-items-center justify-content-start">
                <Form.Label className="me-5">Price</Form.Label>
              </Col>
              <Col xs={6} className="d-flex align-items-center">
                <Prices view={view} price={price} />
              </Col>
            </Row>
            <Row>
              <Form.Text hidden={euroValid} className="text-danger">Please select a Price Value.</Form.Text>
            </Row>
          </Form.Group>

          <Row hidden={view} ><hr />
            <ButtonGroup style={{width:"180px"}}>
              <Button className="btn-lg mx-1 mb-2" type='submit' variant="primary">{reviewId ? 'Update' : 'Add'}</Button>
              <Button hidden={view} onClick={() => { navigate(-1) }} className="btn-lg mx-1 mb-2" variant='warning'>Cancel</Button>
              <Button className="btn-lg mx-1 mb-2 " hidden={ !reviewId ?  true : !(user && username == user.username )} variant="danger" onClick={() => { setShow(true) }}
              ><i className="bi bi-trash "></i></Button>
            </ButtonGroup>
          </Row>
          <Row>
          <ConfirmModal text={'Delete the Review'} show={show} setShow={setShow}    action={() => {
        deleteReview(reviewId);
        navigate(`/restaurants/${id}/reviews`);
    }}/>
          </Row>
        </Form>


      </Container>    </>
  )

}
export { ReviewForm };
