import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Card, Col, Row, Button, FormControl } from 'react-bootstrap';
import { Header } from './Header';
import { NavigationButtons } from './NavigationButtons';
import { SearchBar } from './Home';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import dayjs from 'dayjs';


function SearchReview(props) {
    const { list, setList } = props;
    const [label, setLabel] = useState("NEWEST");
    const [order, setOrder] = useState("ASC");
    const navigate = useNavigate();

    /*const sortByPrices = (order) => {
    let sortedList;
    if (order === 'asc') {
      sortedList = [...list].sort((a, b) => a.prices - b.prices);
    } else {
      sortedList = [...list].sort((a, b) => b.prices - a.prices);
    }
   setList(sortedList);
  };
*/
    const sortByField = (field, name) => {
        let sortedList;

        if (order === 'asc') {
            sortedList = [...list].sort((a, b) => a[field] > b[field] ? 1 : -1);
        } else {
            sortedList = [...list].sort((a, b) => a[field] < b[field] ? 1 : -1);
        }
        setLabel(name);
        setList(sortedList);
    };

    const sortByDate = (name) => {
        let sortedList;
        if (order === 'asc') {
            sortedList = [...list].sort((a, b) => dayjs(a.date).diff(dayjs(b.date), "day"));
        } else {
            sortedList = [...list].sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day"));
        }
        setLabel(name);
        setList(sortedList);
    }
    const toggleOrder = () => {
        const newOrder = order === 'asc' ? 'desc' : 'asc';
        setOrder(newOrder);
    };
    return (
        <>
            <Row className='my-1 mx-0 d-flex align-items-center'>
                <Col xs={1} >
                    <i className="bi bi-search " style={{ fontSize: "1.5rem", marginLeft: "1%" }}></i>
                </Col>
                <Col xs={8}>
                    <FormControl type="search" placeholder="Search" />
                </Col>
                <Col xs={2}>
                    <Button variant="warning" className="btn-sm" onClick={() => navigate('/restaurants/:id/reviews/add')}>Add a review</Button>
                </Col>
            </Row>
            <Row className='my-1 mx-0 '>
                <Col >
                    <DropdownButton id="dropdown" title={"SORT BY: " + label} variant="info" >
                        <Dropdown.Item onClick={() => sortByDate( "DATE")}>DATE</Dropdown.Item>
                        <Dropdown.Item onClick={() => sortByDate( "PRICE")}>PRICE</Dropdown.Item>
                        <Dropdown.Item onClick={() => sortByField('prices', "QUALITY")}>QUALITY</Dropdown.Item>
                        <Dropdown.Item onClick={() => sortByField('prices',  "SAFETY")}>SAFETY</Dropdown.Item>
                    </DropdownButton>
                </Col>
                <Col>
                    {order === 'asc' ? (
                        <i className="bi bi-sort-up" onClick={toggleOrder} style={{ fontSize: "1.5rem" }} />
                    ) : (
                        <i className="bi bi-sort-down" onClick={toggleOrder} style={{ fontSize: "1.5rem" }} />
                    )}
                </Col>
                {

                    // FARE FRECCIA PER ORDINARE ANZICHE' DI TUTTI E 8 I CAMPI
                    // FISSARE WIDTH DEL BOTTONE
                }
                {/*<Col>
            <Button variant="warning">{label}</Button>
    </Col>*/}
            </Row>
        </>
    )
}
function ReviewsList() {
    const navigate = useNavigate();

    const [list, setList] = useState([
        { key: '1', name: 'alecosta', stars: '4', prices: '4', ReviewTitle: 'Nice', date: "2023/01/18" },
        { key: '2', name: 'davide', stars: '3', prices: '3', ReviewTitle: 'Good', date: "2023/01/22" },
        { key: '3', name: 'grammar man', stars: '5', prices: '5', ReviewTitle: 'Nice', date: "2024/01/18" },
        { key: '4', name: 'new person 1', stars: '2', prices: '2', ReviewTitle: 'Good', date: "2025/01/18" },
        { key: '5', name: 'new person 2', stars: '4', prices: '3', ReviewTitle: 'Nice', date: "2026/01/18" },
        { key: '6', name: 'new person 3', stars: '3', prices: '4', ReviewTitle: 'Good', date: "2023/01/18" },
        { key: '7', name: 'john doe', stars: '4', prices: '5', ReviewTitle: 'Nice', date: "2023/01/8" },
        { key: '8', name: 'mary smith', stars: '5', prices: '4', ReviewTitle: 'Good', date: "2023/01/15" },
        { key: '9', name: 'jane doe', stars: '3', prices: '2', ReviewTitle: 'Nice', date: "2023/01/16" },
        { key: '10', name: 'alex brown', stars: '4', prices: '3', ReviewTitle: 'Nice', date: "2023/01/17" },
    ])

    return (
        <>
            <SearchReview list={list} setList={setList} />
            <ListGroup>
                {list.sort((a, b) => dayjs(b.date).diff(dayjs(a.date), "day")).map((item) => {
                    return (
                        <Card key={item.id} onClick={() => { navigate(`/restaurants/${item.id}/reviews/add`) }}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>{item.name}</Card.Title>
                                    </Col>
                                    <Col>
                                        <Card.Text>
                                            {
                                                Array.from({ length: item.stars }, (_, index) => (
                                                    <i key={index} className="bi bi-star-fill"></i>
                                                ))
                                            }
                                        </Card.Text>
                                        <Card.Text>
                                            {
                                                Array.from({ length: item.prices }, (_, index) => (
                                                    <i key={index} className="bi bi-currency-euro"></i>
                                                ))
                                            }
                                        </Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Card.Text>
                                        {item.ReviewTitle}
                                    </Card.Text>
                                </Row>
                                <Row>
                                    <Card.Text>
                                        {item.date}
                                    </Card.Text>
                                </Row>

                            </Card.Body>
                        </Card>
                    );
                })}
            </ListGroup>
        </>
    );
}

function Reviews() {

    return (
        <>
            <Header />
            <ReviewsList />
            <NavigationButtons />
        </>
    )
}

export { Reviews };