import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListGroup, Card, Col, Row, Button, FormControl } from 'react-bootstrap';
import { UserContext } from './userContext';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import dayjs from 'dayjs';

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
function SearchReview(props) {
  const { filteredReviews, reviews, setFilteredReviews, search, setSearch } = props;
  const [label, setLabel] = useState("DATE");
  const [order, setOrder] = useState("DESC");
  const user = useContext(UserContext);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Sort the reviews initially based on 'QUALITY' when the component mounts
    sortByField("date", filteredReviews);
  }, []);



  const sortByField = (field, list) => {
    const name = field.toUpperCase();
    setLabel(name);
    //const sortedList = order === 'ASC' ? [...list].sort((a, b) => a[field] - b[field] ) : [...list].sort((a, b) => b[field] - a[field] );
    //console.log(field)
    if (field == "date") {
      const sortedList = order === 'ASC' ? [...list].sort((a, b) => dayjs(a.date).diff(dayjs(b.date), "day"))
        :
        [...list].sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day"))
      setFilteredReviews(sortedList);
    } else {
      const sortedList = order === 'ASC' ? [...list].sort((a, b) => a[field] - b[field])
        :
        [...list].sort((a, b) => b[field] - a[field])
      setFilteredReviews(sortedList);
    }
  };

  const toggleOrder = () => {
    const sortedList = [...filteredReviews].reverse();
    setFilteredReviews(sortedList);
    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    //console.log(order, label);
  };
  const handleSearch = (ev) => {
    setSearch(ev.target.value);
    const searched = reviews.filter((review) =>
      (review.title.toLowerCase().includes(ev.target.value.trim().toLowerCase())) || review.description.toLowerCase().includes(ev.target.value.trim().toLowerCase()))

    sortByField(label.toLowerCase(), searched);
  };
  const userReview = user? reviews.find(review => review.username === user.username):"";
  return (
    <>
      <Row className='my-1 mx-0 d-flex align-items-center'>
        <Col xs={1} >
          <i className="bi bi-search " style={{ fontSize: "1.5rem", marginLeft: "1%" }}></i>
        </Col>
        <Col xs={6}>
          <FormControl value={search} onChange={handleSearch} type="search" placeholder="Search" />
        </Col>
        <Col xs={2}>
          {userReview ?
            <Button style={{ whiteSpace: "nowrap" }} variant="warning"  onClick={() => navigate(`/restaurants/${id}/reviews/edit/${userReview.id}`)}>Edit review</Button>
            :
            <Button style={{ whiteSpace: "nowrap" }} variant="primary" onClick={() => navigate(`/restaurants/${id}/reviews/add`)}>Add review</Button>
          }
        </Col>
      </Row>
      <Row className='my-1 mb-3  mx-0 '>
        <Col xs={8} >
          <DropdownButton id="dropdown" title={"SORT BY: " + label} variant="info" >
            <Dropdown.Item onClick={() => sortByField("date", filteredReviews)}>DATE</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("price", filteredReviews)}>PRICE</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("quality", filteredReviews)}>QUALITY</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("safety", filteredReviews)}>SAFETY</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col >
          {order === 'ASC' ? (
            <i className="bi bi-sort-down" onClick={toggleOrder} style={{ fontSize: "1.5rem" }} />
          ) : (
            <i className="bi bi-sort-up" onClick={toggleOrder} style={{ fontSize: "1.5rem" }} />
          )} {label === "DATE" ? (order === "ASC" ? "OLD" : "NEW") : order.toUpperCase()}

        </Col>
        {
          // FISSARE WIDTH DEL BOTTONE
        }
        {/*<Col>
    </Col>*/}
      </Row>
    </>
  )
}

function ReviewsList({ reviews }) {
  const navigate = useNavigate();
  const reviewsHeight = (window.innerHeight - 342);
  const { id } = useParams();
  //const [list, setList] = useState(reviews);
  const user = useContext(UserContext);
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [search, setSearch] = useState("")

  return (
    <>
      <SearchReview filteredReviews={filteredReviews} reviews={reviews} search={search} setSearch={setSearch} setFilteredReviews={setFilteredReviews} />
      <ListGroup className="scroll" style={{ overflowY: "auto", maxHeight: reviewsHeight }}>
        {//list.sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day")).map((item) => {
          //   list.map((item) => {
          reviews.length === 0 ?
            <p style={{ marginTop: "1rem", marginLeft: "0.4rem" }}> No reviews for this Restaurant, add the first! </p>
            :
            filteredReviews.length === 0 ?
              <p style={{ marginTop: "1rem", marginLeft: "0.4rem" }}> No result for "<b>{search}</b>" in these reviews! </p>
              :
              filteredReviews.map((item) => {
                return (
                  <Card key={item.id} style={{ borderRadius: 0 }} onClick={user?item.username == user.username ? () => { navigate(`/restaurants/${id}/reviews/edit/${item.id}`) } : () => { navigate(`/restaurants/${id}/reviews/${item.id}`) }:null}>
                    <Card.Body>
                      <Row>
                        <Col>
                          <Card.Title>{item.title}</Card.Title>
                        </Col>
                        <Row>
                          <Col><Card.Subtitle>{item.description}</Card.Subtitle></Col>
                        </Row>
                      </Row>
                      <Row>
                        <Col xs={4} ><Card.Text style={{ fontSize: "1.2em" }}>Quality:</Card.Text></Col>
                        <Col xs={8}><Card.Text>
                          {Array.from({ length: item.quality }, (_, index) => (
                            <i key={index} className="bi bi-star-fill" style={{ color: '#FFD700', marginRight: "5px", fontSize: "1.4em" }} ></i>
                          ))}
                        </Card.Text></Col>
                      </Row>

                      <Row>
                        <Col xs={4}><Card.Text style={{ fontSize: "1.2em" }}>Safety:</Card.Text></Col>
                        <Col xs={8}>
                          <Card.Text>
                            {Array.from({ length: 5 }, (_, index) => (
                              <FontAwesomeIcon
                                key={index}
                                icon={(index + 1 != item.safety) ? getHappinessClass(index) : getHappinessSolidClass(index)}
                                style={{ color: (index < 5) ? getHappinessColor(index) : "", marginTop:"5px" ,marginRight: "5px", fontSize: "1.4em" }} />))}
                          </Card.Text>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={4} ><Card.Text style={{ fontSize: "1.2em" }}>Prices:</Card.Text></Col>
                        <Col xs={8} ><Card.Text>
                          {Array.from({ length: item.price }, (_, index) => (
                            <i key={index} className="bi bi-currency-euro" style={{ marginRight: "5px", fontSize: "1.4em" }}></i>
                          ))}
                        </Card.Text></Col>
                      </Row>
                      <Row >
                        <footer style={{ fontSize: "1em" }} className="blockquote-footer">By {item.username}, {dayjs(item.date).format("DD-MM-YYYY")}</footer>
                      </Row>

                    </Card.Body>
                  </Card>
                );
              })}
      </ListGroup>
    </>
  );
}

function Reviews(props) {

  return <ReviewsList reviews={props.reviews} />
}

export { Reviews };