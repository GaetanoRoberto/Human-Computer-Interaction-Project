import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import { ButtonGroup, Form, Button, Alert, Row, Col, Image, Container, Card, Badge } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Header } from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext, setDirtyContext } from './userContext';
import ConfirmModal from './ConfirmModal';
import API from '../API';
import { ErrorContext } from './userContext';
import { approssimaValoreAlRange } from './Costants';


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
  const handleError = useContext(ErrorContext);
  const setDirty = useContext(setDirtyContext);

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
  const [titleInvalid, setTitleInvalid] = useState(false);
  const [descInvalid, setDescInvalid] = useState(false);
  // disabled flag
  //const disabled_flag = title === '' || description === '' || quality === 0 || safety === 0 || price === 0;

  const [show, setShow] = useState(false);
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
        .catch((err) => handleError(err));
    }
  }, []);

  const addReview = (review) => {
    API.createReview(review)
      .then(() => { setDirty(true); })
      .catch(e => handleError(e));
  }
  const editReview = (review) => {
    API.updateReview(review)
      .then(() => { setDirty(true); })
      .catch(e => handleError(e));
  }
  const deleteReview = (review) => {
    API.deleteReview(review)
      .then(() => { setDirty(true); })
      .catch(e => handleError(e));
  }
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
    if (title === '' || title.trim().length === 0) {
      setTitleInvalid(true);
      valid = false;
    }
    if (description === '' || description.trim().length === 0) {
      setDescInvalid(true);
      valid = false;
    }
    if (quality == 0) {
      setQualityValid(false);
      valid = false;
    }
    if (safety == 0) {
      setSafetyValid(false);
      valid = false;

    }
    if (price == 0) {
      setEuroValid(false);
      valid = false;
    }

    if (valid) {
      const review = {
        username: username,
        restaurantId: id,
        date: dayjs(date).format("YYYY-MM-DD"),
        title: title,
        description: description,
        quality: quality,
        safety: safety,
        price: price
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
      <Container>
        {view ?
          <Card className="mt-4 border" style={{ overflowY: "scroll", maxHeight: 650 }}>
            <Card.Body className="p-4">
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <div>
                <Form.Label style={{fontSize:'large'}}>Username:</Form.Label>
                  <p>{username}</p>
                </div>
                <div>
                <Form.Label style={{fontSize:'large'}}>Date:</Form.Label>
                  <p>{dayjs(date).format("YYYY-MM-DD")}</p>
                </div>
              </div>
              <div>
                <Form.Label style={{fontSize:'large'}}>Title:</Form.Label>
                <p>{title}</p>
              </div>
              <div className="mb-2">
              <Form.Label style={{fontSize:'large'}}>Description:</Form.Label>
                <p>{description}</p>
              </div>
              <div className="mb-2">
              <Form.Label style={{fontSize:'large'}}>Quality:</Form.Label>
                <p>    <Rating view={view} quality={quality} />
                </p>
              </div>
              <div className="mb-2">
              <Form.Label style={{fontSize:'large', marginBottom:'5%'}}>Safety:</Form.Label>
                <p>    <HappinessRating view={view} safety={safety} />
                </p>
              </div>
              <div className="mb-2">
              <Form.Label style={{fontSize:'large'}}>Price:</Form.Label>
                <p>    <Prices view={view} price={price} />
                </p>
                <h6>Price Range: {approssimaValoreAlRange(price)} €</h6>

              </div>
            </Card.Body>
          </Card>
          : (
            <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col lg={true}>
                  <Form.Label style={{marginTop:'2%'}}>Username:</Form.Label>
                  <Form.Control disabled readOnly type="text" name="username" value={username} />
                </Col>
                <Col lg={true} >
                  <Form.Label style={{marginTop:'2%'}}>Date:</Form.Label>
                  <Form.Control disabled readOnly type="date" name="date" value={dayjs(date).format("YYYY-MM-DD")} />
                </Col>
              </Row>
              <Form.Group controlId="formTitle">
                <Form.Label style={{marginTop:'2%'}}>Title:</Form.Label>
                <Form.Control className="form-control-green-focus" type="text" isInvalid={titleInvalid} disabled={view} required name="title" value={title} onChange={ev => { setTitle(ev.target.value); setTitleInvalid(false); }} />
                <Form.Control.Feedback type="invalid">Please choose a Title.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label style={{marginTop:'2%'}}>Description:</Form.Label>
                <Form.Control className="form-control-green-focus" as="textarea" isInvalid={descInvalid} required disabled={view} rows={3} name="description" value={description} onChange={ev => { setDescription(ev.target.value); setDescInvalid(false); }} />
                <Form.Control.Feedback type="invalid">Please choose a Description.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formQuality">
                <Row style={{marginTop:'3%'}}>
                  <Col xs={3} className="d-flex align-items-center justify-content-start">
                    <Form.Label className="me-5 mb-0" style={{marginTop:'2%'}}>Quality:</Form.Label>
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
                <Row style={{marginTop:'3%'}}>
                  <Col xs={3} className="d-flex align-items-center justify-content-start">
                    <Form.Label className="me-5 mb-0" style={{marginTop:'2%'}}>Safety:</Form.Label>
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
                <Row style={{marginTop:'3%'}}>
                  <Col xs={3} className="d-flex align-items-center justify-content-start">
                    <Form.Label className="me-5 mb-0" style={{marginTop:'2%'}}>Price:</Form.Label>
                  </Col>
                  <Col xs={6} className="d-flex align-items-center">
                    <Prices view={view} price={price} />
                  </Col>
                  <h6 hidden={price === 0}>Price Range: {approssimaValoreAlRange(price)} €</h6>
                </Row>
                <Row>
                  <Form.Text hidden={euroValid} className="text-danger">Please select a Price Value.</Form.Text>
                </Row>
              </Form.Group>

              <Row hidden={view} ><hr />
                <Col xs={6}>
                  <Button
                    className="btn-lg mx-1 mb-2"
                    hidden={!reviewId ? true : !(user && username === user.username)}
                    variant="danger"
                    onClick={() => { setShow(true) }}
                  >Delete
                  </Button>
                </Col>
                <Col xs={6} className="text-end">
                  <Button className="btn-lg mx-1 mb-2" type='submit' variant="success">
                    {reviewId ? 'Save' : 'Save'}
                  </Button>
                </Col>
              </Row>
              <Row>
                <ConfirmModal text={'Delete the Review'} show={show} setShow={setShow} action={() => {
                  deleteReview(reviewId);
                  navigate(`/restaurants/${id}/reviews`);
                }} />
              </Row>
            </Form>

          )}
      </Container>    </>
  )

}
export { ReviewForm };
