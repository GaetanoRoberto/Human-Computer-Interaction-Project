import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import { ButtonGroup, Form, Button, Alert, Row, Col, Image } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Header } from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Rating(props) {
  const [starsSelected, setStarsSelected] = useState(props.rating);

  const handleStarClick = (value) => {
    setStarsSelected(value);
  };

  return [...Array(5)].map((el, index) =>
    <i onClick={() => handleStarClick(index + 1)} key={index} 
      className={(index < starsSelected) ? "bi bi-star-fill " : "bi bi-star"} 
      style={{ color:  '#FFD700', marginRight: "5px",
      fontSize: "2em"
    }} />
  );
}
function Prices(props) {
  const [euros, setEuros] = useState(props.prices);

  const handleEuros = (value) => {
    setEuros(value);
  };

  return [...Array(5)].map((el, index) =>
    <i onClick={() => handleEuros(index + 1)} key={index} 
      className={"bi bi-currency-euro" } 
      style={{ color:(index < euros) ?  "#000": "#DCDCDC",marginRight: "5px",
      fontSize: "2em"
    }} />
  );
}
function HappinessRating(props) {
  const [selectedHappiness, setSelectedHappiness] = useState(props.happy);

  const handleHappinessClick = (happinessIndex) => {
    setSelectedHappiness(happinessIndex);
  };

  return [...Array(5)].map((el, index) =>
    <FontAwesomeIcon
      key={index}
      onClick={() => handleHappinessClick(index + 1)}
      icon={(index+1 != selectedHappiness) ? getHappinessClass(index) : getHappinessSolidClass(index)}
      style={{color:(index < 5) ? getHappinessColor(index) : "",marginRight: "5px",
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
const ReviewForm = (props) => {



  // pageID da URL
  const { pageId } = useParams();
  const location = useLocation();
  // location.pathname = /reviews/:id of view or /edit/:id or /add
  const view = location.pathname === `/restaurants/${pageId}`
  // info pagina
  const [title, setTitle] = useState('');
  const [datePubbl, setDatePubbl] = useState(null);

  const navigate = useNavigate();
  // USE EFFECT 


  function handleSubmit(event) {
    event.preventDefault();//non invio subito dati del form

    // Form validation
   /* if (title === '' || title.trim().length === 0)
      setErrorMsg('Titolo non valido');
    else if (!hasHeader || !paragOrImage)
      setErrorMsg("La pagina deve contenere almeno un header e almeno un paragrafo o un'immagine");
    else if (isEmpty)
      setErrorMsg("La pagina non puo' contenere blocchi vuoti");
    else */{
      const page = {
        titolo: title,
        autoreId: user.isAdmin ? findUserIdByUsername(author) : user.id,//get autoreId
        dataCreazione: dayjs(dateCreation).format("YYYY-MM-DD"),
        dataPubblicazione: datePubbl ? dayjs(datePubbl).format("YYYY-MM-DD") : null,
        blocchi: content.map((block) => ({
          tipo: block.contentType,
          contenuto: block.contentValue,
          posizione: block.position
        }))
      }
      if (pageId) {  // per vedere se sono in add o in edit
        page.id = pageId;//url
        props.editPage(page);
      } else {
        props.addPage(page);
      }
      navigate('/backoffice');
    }
  }
  const [formData, setFormData] = useState({
    username: '',
    restaurantId: '',
    date: '',
    title: '',
    description: '',
    quality: 0,
    safety: 0,
    price: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [review, setReview] = useState(
    { key: '1', name: 'alecosta', stars: '4', prices: '4', ReviewTitle: 'Nice', date: "2023/01/18" },
  )

  return (
    <>
      <Header />
      <Form className="mx-2 " onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control disabled  type="text" name="username" value={review.name} onChange={handleChange} />
            </Form.Group></Col>
          <Col>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control disabled type="date" name="date" value={dayjs(review.date).format("YYYY-MM-DD")} onChange={handleChange} />
            </Form.Group></Col>
        </Row>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" name="title" value={review.ReviewTitle} onChange={handleChange} />
        </Form.Group>

        <Form.Group   controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={review.description} onChange={handleChange} />
        </Form.Group>

  <Row>
    <Col xs={3} className="d-flex align-items-center justify-content-start">
      <Form.Label className="me-5">Quality</Form.Label>
    </Col>
    <Col xs={6} className="d-flex align-items-center">
      <Rating rating={review.stars}  />
    </Col>
  </Row>

  <Row>
    <Col xs={3} className="d-flex align-items-center justify-content-start">
      <Form.Label className="me-5">Safety</Form.Label>
    </Col>
    <Col xs={6} className="d-flex align-items-center">
    <HappinessRating happy={review.stars}/>
    </Col>
  </Row>

  <Row>
    <Col xs={3} className="d-flex align-items-center justify-content-start">
      <Form.Label className="me-5">Price</Form.Label>
    </Col>
    <Col xs={6} className="d-flex align-items-center">
      <Prices prices={review.prices}  />
    </Col>
  </Row>


        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

    </>
  )

}
export { ReviewForm };
