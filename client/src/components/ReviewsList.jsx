import {useState, useContext, useEffect, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListGroup, Card, Col, Row, Button, FormControl } from 'react-bootstrap';
import { UserContext } from './userContext';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorContext } from './userContext';
import API from '../API';
import dayjs from 'dayjs';
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
function SearchReview(props) {
  const { filteredReviews, reviews, setFilteredReviews, search, setSearch } = props;
  const [label, setLabel] = useState("DATE");
  const [order, setOrder] = useState("DESC");
  const user = useContext(UserContext);

  const { id } = useParams();
  const navigate = useNavigate();
  const handleError = useContext(ErrorContext);
  const [restaurant, setRestaurant] = useState([])
  const [yourRestaur,setYourRestaur] = useState(true);
  //const yourRestaurant = user && user.isRestaurateur == 1 && restaurant.isNewInserted == 1 && id == restaurant.id ? true : false;
  //console.log(yourRestaur);

  useEffect(() => {
    const getInsertedRestaurant = async () => {
      // Sort the reviews initially based on 'DATE' when the component mounts
      sortByField("date", filteredReviews);
      try {
        const restaurant = await API.getInsertedRestaurant();
        //console.log(restaurant);
        if (restaurant.error == "Restaurant not found.") {
          setRestaurant(null);
        } else {
          setRestaurant(restaurant);
        }
        setYourRestaur(user && user.isRestaurateur == 1 && restaurant.isNewInserted == 1 && id == restaurant.id ? true : false)
      } catch (error) {
        handleError(error);
      }
    }

    getInsertedRestaurant();
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
  const userReview = user ? reviews.find(review => review.username === user.username) : "";
  return (
    <>
      <Row className="align-items-center" style={{ marginRight: 0, marginTop: "0.2rem", marginLeft: 0, marginBottom: "0.2rem" }}>
        <Col xs={1} className="d-flex align-items-center" style={{ marginRight: "2%" }}>
          <i className="bi bi-search" style={{ fontSize: "1.5rem" }}></i>
        </Col>
        <Col xs={10}>
          <FormControl value={search} onChange={handleSearch} type="search" placeholder="Search title or description" className="form-control-green-focus"/>
        </Col>
      </Row>
      <Row className='my-1 mx-0 '>
        <Col style={{padding:'5px'}}>
          <DropdownButton id="dropdown-Review" className="dropdown-modificato" title={"SORT BY: " + label} variant="success" >
            <Dropdown.Item onClick={() => sortByField("date", filteredReviews)}>DATE</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("price", filteredReviews)}>PRICE</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("quality", filteredReviews)}>QUALITY</Dropdown.Item>
            <Dropdown.Item onClick={() => sortByField("safety", filteredReviews)}>SAFETY</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col style={{padding:'5px'}} onClick={toggleOrder}>
          {order === 'ASC' ? (
            <i className="bi bi-sort-down"  style={{ fontSize: "1.5rem" }} />
          ) : (
            <i className="bi bi-sort-up" style={{ fontSize: "1.5rem" }} />
          )} {label === "DATE" ? (order === "ASC" ? "OLD" : "NEW") : order.toUpperCase()}

        </Col>
        {!yourRestaur ?
          <Col style={{padding:'5px'}}>
            {userReview ?
              <Button style={{ whiteSpace: "nowrap" }} variant="success" onClick={() => navigate(`/restaurants/${id}/reviews/edit/${userReview.id}`)}>Edit review</Button>
              :
              <Button style={{ whiteSpace: "nowrap" }} className='light-green' onClick={() => navigate(`/restaurants/${id}/reviews/add`)}>Add review</Button>
            }
          </Col>
          :
          " "
        }
      </Row>
    </>
  )
}

function ReviewsList({ reviews, divHeight }) {
  const navigate = useNavigate();
  const reviewsHeight = (divHeight === 166 ? window.innerHeight - 360 : divHeight === 195 ? window.innerHeight - 390 : divHeight === 175 ? window.innerHeight - 370 : window.innerHeight - 340);
  const { id } = useParams();
  const reviewsRef = useRef();
  //const [list, setList] = useState(reviews);
  const user = useContext(UserContext);
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [search, setSearch] = useState("")


  useEffect(() => {
    if (reviewsRef.current) {
      setTimeout(() => {
        reviewsRef.current.scrollTop = localStorage.getItem('scrollPositionReviews') || 0;
      }, 1);
    }
    // added 10/02
    const getRestaurant = async () => {
      try {
          const restaurant = await API.getRestaurant(id);
          setFilteredReviews(restaurant.reviews)
      } catch (error) {
          handleError(error);
      }
  }

  getRestaurant();



  }, []);

  const handleScrollReviews = () => {
    localStorage.setItem('scrollPositionReviews', reviewsRef.current.scrollTop);
  };


  return (
    <>
      <SearchReview filteredReviews={filteredReviews} reviews={reviews} search={search} setSearch={setSearch} setFilteredReviews={setFilteredReviews} />
      <div style={{ borderTop: "1px solid #000", margin: 0 }}></div>
      <ListGroup onScroll={handleScrollReviews} ref={reviewsRef} style={{ overflowY: "scroll", maxHeight: reviewsHeight }}>
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
                  <Card key={item.id} style={{ borderRadius: 0 }} onClick={user ? item.username == user.username ? () => { navigate(`/restaurants/${id}/reviews/edit/${item.id}`) } : () => { navigate(`/restaurants/${id}/reviews/${item.id}`) } : null}>
                    {/*<Button variant="light" style={{padding: "0 0 0 0"}}>*/}
                    <Card.Body>
                      <Row>
                        <Col>
                          <Card.Title>{item.title}</Card.Title>
                        </Col>
                        <Row>
                          <Col><Card.Subtitle>{item.description}</Card.Subtitle></Col>
                        </Row>
                      </Row>
                      <Row className='mt-2'>
                      <Col xs={4} style={{display:'flex', alignItems:'center' }}><Card.Text style={{ fontSize: "1.2em" }}>Quality:</Card.Text></Col>
                        <Col xs={8}><Card.Text>
                          {Array.from({ length: item.quality }, (_, index) => (
                            <i key={index} className="bi bi-star-fill" style={{ color: '#FFD700', marginRight: "5px", fontSize: "1.4em" }} ></i>
                          ))}
                        </Card.Text></Col>
                      </Row>

                      <Row>
                      <Col xs={4} style={{display:'flex', alignItems:'center' }}><Card.Text style={{ fontSize: "1.2em" }}>Safety:</Card.Text></Col>
                        <Col xs={8}>
                          <Card.Text>
                            {Array.from({ length: 5 }, (_, index) => (
                              <FontAwesomeIcon
                                key={index}
                                icon={(index + 1 != item.safety) ? getHappinessClass(index) : getHappinessSolidClass(index)}
                                style={{ color: (index < 5) ? getHappinessColor(index) : "", marginTop: "5px", marginRight: "5px", fontSize: "1.4em" }} />))}
                          </Card.Text>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={4} ><Card.Text style={{ fontSize: "1.2em" }}>Price:</Card.Text></Col>
                        <Col xs={8} ><Card.Text style={{ fontSize: "1.2em" }}>
                        <i className="bi bi-currency-euro" style={{ marginRight: "5px" }}></i>
                                {approssimaValoreAlRange(item.price)}
                        </Card.Text></Col>
                      </Row>
                      <Row >
                        <footer style={{ fontSize: "1em", margin:'0' }} className="blockquote-footer">By {item.username}, {dayjs(item.date).format("DD-MM-YYYY")}</footer>
                      </Row>

                    </Card.Body>
                    {/*</Button>*/}
                  </Card>
                );
              })}
      </ListGroup>
    </>
  );
}

function Reviews(props) {

  return <ReviewsList reviews={props.reviews} divHeight={props.divHeight} />
}

export { Reviews };