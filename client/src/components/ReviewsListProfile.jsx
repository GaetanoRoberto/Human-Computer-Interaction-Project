import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Card, Col, Row, Button, FormControl } from 'react-bootstrap';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import API from '../API';
import { approssimaValoreAlRange } from './Costants';

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

function ReviewsListProfile(props) {
  const reviewsHeight = (window.innerHeight - 342);
  const navigate = useNavigate();

  return (
    <>
      <ListGroup>
        {props.reviews.sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day")).map((item, index) => {
          return (
            <Card key={index} onClick={() => { navigate(`/restaurants/${item.restaurantId}/reviews/edit/${item.id}`) }}>
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title style={{fontSize:'x-large'}}>{item.restaurant_name}</Card.Title>
                    <Card.Title>{item.title}</Card.Title>
                  </Col>
                  <Row>
                    <Col><Card.Subtitle>{item.description}</Card.Subtitle></Col>
                  </Row>
                </Row>
                <Row className='mt-2'>
                  <Col xs={4} style={{display:'flex', alignItems:'center' }}><Card.Text style={{ fontSize: "1.2em"}}>Quality:</Card.Text></Col>
                  <Col xs={8}><Card.Text>
                    {Array.from({ length: item.quality }, (_, index) => (
                      <i key={index} className="bi bi-star-fill" style={{ color: '#FFD700', marginRight: "5px", fontSize: "1.2em" }} ></i>
                    ))}
                  </Card.Text></Col>
                </Row>

                <Row>
                  <Col xs={4} style={{display:'flex', alignItems:'center' }}><Card.Text style={{ fontSize: "1.2em"}}>Safety:</Card.Text></Col>
                  <Col xs={8}>
                    <Card.Text>
                      {Array.from({ length: 5 }, (_, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={(index + 1 != item.safety) ? getHappinessClass(index) : getHappinessSolidClass(index)}
                          style={{ color: (index < 5) ? getHappinessColor(index) : "", marginTop: "5px", marginRight: "5px", fontSize: "1.2em" }} />))}
                    </Card.Text>
                  </Col>
                </Row>

                <Row>
                  <Col xs={4} style={{display:'flex', alignItems:'center' }}><Card.Text style={{ fontSize: "1.2em"}}>Price:</Card.Text></Col>
                  <Col xs={8} style={{display:'flex', alignItems:'center' }}>
                    <Card.Text>
                    <i className="bi bi-currency-euro" style={{ marginRight: "5px" }}></i>
                    {approssimaValoreAlRange(item.price)}
                    </Card.Text>
                  </Col>
                </Row>
                <Row >
                  <footer style={{ fontSize: "1em", margin: '0' }}>{dayjs(item.date).format("DD-MM-YYYY")}</footer>
                </Row>

              </Card.Body>
            </Card>
          );
        })}
      </ListGroup>
    </>
  );
}


export { ReviewsListProfile };