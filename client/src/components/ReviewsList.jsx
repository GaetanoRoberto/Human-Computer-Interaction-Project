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
    const { list, setList } = props;
    const [label, setLabel] = useState("QUALITY");
    const [order, setOrder] = useState("DESC");
    const { id } = useParams();
    const navigate = useNavigate();




const sortByField = (field) => {
    const name = field.toUpperCase();
    setLabel(name);
    //const sortedList = order === 'ASC' ? [...list].sort((a, b) => a[field] - b[field] ) : [...list].sort((a, b) => b[field] - a[field] );
    //console.log(field)
    if(field == "date"){
        const sortedList = order === 'ASC' ? [...list].sort((a, b) =>dayjs(a.date).diff(dayjs(b.date), "day") ) :[...list].sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day"))
        setList(sortedList);
    }else{
        const sortedList = order === 'ASC' ? [...list].sort((a, b) => a[field] - b[field] ) :  [...list].sort((a, b) => b[field] - a[field])
        setList(sortedList);
    }
  };
    const sortByDate = (name) => {
        let sortedList;
        if (order === 'ASC') {
            sortedList = [...list].sort((a, b) => dayjs(a.date).diff(dayjs(b.date), "day"));
        } else {
            sortedList = [...list].sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day"));
        }
        setLabel(name);
        setList(sortedList);
    }
    const toggleOrder = () => {
        const sortedList = [...list].reverse();
        setList(sortedList);
        setOrder(order === 'ASC' ? 'DESC' : 'ASC');
        //console.log(order, label);
    };
    return (
        <>
            <Row className='my-1 mx-0 d-flex align-items-center'>
                <Col xs={1} >
                    <i className="bi bi-search " style={{ fontSize: "1.5rem", marginLeft: "1%" }}></i>
                </Col>
                <Col xs={7}>
                    <FormControl type="search" placeholder="Search" />
                </Col>
                <Col xs={2}>
                    <Button variant="warning" className="btn-sm" onClick={() => navigate(`/restaurants/${id}/reviews/add`)}>Add a review</Button>
                </Col>
            </Row>
            <Row className='my-1 mb-3  mx-0 '>
                <Col xs={4} >
                    <DropdownButton  id="dropdown"  title={"SORT BY: " } variant="info" >
                        <Dropdown.Item onClick={() => sortByField("date")}>DATE</Dropdown.Item>
                        <Dropdown.Item onClick={() => sortByField("price")}>PRICE</Dropdown.Item>
                        <Dropdown.Item onClick={() => sortByField("quality")}>QUALITY</Dropdown.Item>
                        <Dropdown.Item onClick={() => sortByField("safety")}>SAFETY</Dropdown.Item>
                    </DropdownButton>
                    </Col>
                   <Col xs={4}><Button disabled style={{width:"110px"}} variant="info">{label}</Button>   </Col>
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
    const [list, setList] = useState(reviews);
    const user = useContext(UserContext);

    return (
        <>
            <SearchReview list={list} setList={setList} />
            <ListGroup className="scroll" style={{ overflowY: "auto", maxHeight: reviewsHeight }}>
                {//list.sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day")).map((item) => {
                    list.map((item) => {
                    return (
                        <Card key={item.id} style={{ borderRadius: 0 }} onClick={item.username == user.username ? () => { navigate(`/restaurants/${id}/reviews/edit/${item.id}`) } : () => { navigate(`/restaurants/${id}/reviews/${item.id}`) }}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>{item.title}</Card.Title>
                                    </Col>
                                    {/*<Col><Card.Text>{item.date}</Card.Text></Col>*/}
                                </Row>
                                <Row>
                                    <Col><Card.Text>Quality:</Card.Text></Col>
                                    <Col><Card.Text>
                                        {Array.from({ length: item.quality }, (_, index) => (
                                            <i key={index} className="bi bi-star-fill" style={{ color: '#FFD700', marginRight:"5px" }} ></i>
                                        ))}
                                    </Card.Text></Col>
                                </Row>
                                <Row>
                                    <Col><Card.Text>Prices:</Card.Text></Col>
                                    <Col><Card.Text>
                                        {Array.from({ length: item.price }, (_, index) => (
                                            <i key={index} className="bi bi-currency-euro" style={{ marginRight:"5px"}}></i>
                                        ))}
                                    </Card.Text></Col>
                                </Row>
                                <Row>
                                    <Col><Card.Text>Safety:</Card.Text></Col>
                                    <Col><Card.Text>
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <FontAwesomeIcon
                                                key={index}
                                                icon={(index + 1 != item.safety) ? getHappinessClass(index) : getHappinessSolidClass(index)}
                                                style={{color: (index < 5) ? getHappinessColor(index) : "", marginRight:"5px"}} />))}
                                    </Card.Text></Col>
                                </Row>
                                <Row >
                                <footer style={{fontSize:"1em"}} className="blockquote-footer">By {item.username}, {dayjs(item.date).format("DD-MM-YYYY")}</footer>
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