import { useState, useEffect } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import API from "../API.jsx";
import '../index.css' 
import { AddressSelector } from './RestaurantFormUtility';
import { ReviewsListProfile } from './ReviewsListProfile';
import { BannerProfile } from './Restaurant';
import ConfirmModal from './ConfirmModal';


const ProfileHeader = (props) => {
  const navigate = useNavigate();

  const handleStatusSelection = (status) => () => {
    let checkIfRedirectIsNeeded = false;
    if (props.selectedStatus != status) {
      checkIfRedirectIsNeeded = true;
    }
    props.setSelectedStatus(status);
    if (checkIfRedirectIsNeeded) {
      //navigate('/');
    }
  };

  return (
    <Container>
      <Row className="align-items-center">
          <Col>
              <FontAwesomeIcon icon="fa fa-arrow-left" onClick={() => navigate('/')} style={{ borderRadius: '50%', border: '2px solid black', fontSize: '1.2rem', padding: '0.6rem', paddingLeft: '0.65rem', paddingRight: '0.65rem'}}/>
          </Col>
          {/* <Col >
              <h6>Profile</h6>
          </Col> */}
          <Col xs="auto">
                <Dropdown>
                    <Dropdown.Toggle variant="light" className="d-flex align-items-center" style={{borderRadius: 5, width: 160, border: '1px solid black', marginBottom: 0}}>
                      {props.selectedStatus=="User" ? 
                        <Col className="d-flex align-items-center">
                          <FontAwesomeIcon icon="fa-solid fa-user" style={{ borderRadius: '50%', border: '2px solid black', fontSize: '1.1rem', padding: '0.3rem', paddingLeft: '0.35rem', paddingRight: '0.35rem'}} />
                          <p style={{marginTop: 14, marginLeft: 8, fontSize: '0.85rem'}}>User</p>
                        </Col> 
                        :
                        <Col className="d-flex align-items-center"> 
                          <FontAwesomeIcon icon="fa-solid fa-utensils" style={{ borderRadius: '50%', border: '2px solid black', fontSize: '1.1rem', padding: '0.3rem', paddingLeft: '0.35rem', paddingRight: '0.35rem'}} />
                          <p style={{marginTop: 14, marginLeft: 8, fontSize: '0.85rem'}}>Restaurater</p>
                        </Col>
                      }
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{borderRadius: 5, width: 160, border: '1px solid black' }}>
                      <Col>
                        {props.selectedStatus=="Restaurater" ?
                        <Dropdown.Item onClick={handleStatusSelection('User')} className="profile-dropdown-item d-flex align-items-center" style={{borderTop: "1px solid lightgray", borderBottom: "1px solid lightgray"}}> {/*BOOTSTRAP CLASS */}
                            <FontAwesomeIcon icon="fa-solid fa-user" style={{ borderRadius: '50%', border: '2px solid black', fontSize: '1.1rem', padding: '0.3rem', paddingLeft: '0.35rem', paddingRight: '0.35rem'}} />
                            <p style={{marginTop: 14, marginLeft: 8, fontSize: '0.85rem'}}>User</p>
                        </Dropdown.Item>
                        : <></>
                        }
                      </Col>
                      <Col>
                        {props.selectedStatus=="User" ?
                        <Dropdown.Item onClick={handleStatusSelection('Restaurater')} className="profile-dropdown-item d-flex align-items-center" style={{borderTop: "1px solid lightgray", borderBottom: "1px solid lightgray"}}>
                            <FontAwesomeIcon icon="fa-solid fa-utensils" style={{ borderRadius: '50%', border: '2px solid black', fontSize: '1.1rem', padding: '0.3rem', paddingLeft: '0.35rem', paddingRight: '0.35rem'}} />
                            <p style={{marginTop: 14, marginLeft: 8, fontSize: '0.85rem'}}>Restaurater</p>
                        </Dropdown.Item>
                        : <></>
                        }
                      </Col>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
      </Row>
    </Container>
  );
}

function MyLocation(props) {
  const { address, setAddress } = props;

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // const defaultLocation = "Corso Duca degli Abruzzi, 24, Turin, Metropolitan City of Turin, Italy"; 
    // setAddress({ text: defaultLocation, lat: latitude, lng: longitude, invalid: false });

    //REMOVE THE FOLLOWING COMMENTS TO CONVERT LATITUDE AND LONGITUDE IN THE CURRENT ADDRESS (EXPLOITING GOOGLE MAPS API)
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const latLng = { lat: latitude, lng: longitude };

      geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results[0]) {
              setAddress({ text: results[0].formatted_address, lat: latitude, lng: longitude, invalid: false });
              resolve(undefined); // Resolve with undefined for a valid address
          } else {
              setAddress({ text: results[0].formatted_address, lat: latitude, lng: longitude, invalid: true });
              reject(true); // Resolve with true for an invalid address
              //reject('Geocode was not successful for the following reason: ' + status);
          }
      });
    });
  }

  function error(err) {
    console.log("Unable to retrieve your location");
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  return (
    <div>
      <Button variant="primary" onClick={handleLocationClick} style={{width: '100%', marginTop: 10}}>
        <><FontAwesomeIcon icon="fas fa-map-marker-alt" style={{"marginRight": 10}}/>Use your location</>
      </Button>
      {/* {location ? (
        <div>
          <p>Location: {location.latitude}, {location.longitude}</p>
        </div>
      ) : null} */}
    </div>
  );
}

const ProfileInformation = (props) => { //USERNAME, YOURSTATUS, POSITION
    const navigate = useNavigate();

    return (
      <>
        <Container fluid>  
          <Col className="mb-2" style={{marginTop: 25}}>
            <Row as="h1" style={{borderBottom: '1px solid lightgray'}}>Your Info</Row>
            <Row as="h4" className="text-secondary">
              Name
            </Row>
          </Col>
          <Col className="mb-2" style={{marginTop: 40}}>
            <Row as="h1" style={{marginTop: 30, marginBottom: 14.1, borderBottom: '1px solid lightgray'}}>Enter Your Location</Row>
            <Row style={{marginLeft: "-22.5px"}}>
            <AddressSelector address={props.address} setAddress={props.setAddress} />
            <MyLocation address={props.address} setAddress={props.setAddress}/>
            </Row>
          </Col>
        </Container>
      </>
      );
}

const ReviewRow = (props) => {  {/*ME LO PASSA GAETANO*/}
    const { reviews, setReviews, restaurant } = props;
    const navigate = useNavigate();

    return (
      <Container fluid>
      <Col className="mb-2" style={{marginTop: 40}}>
        <Row as="h1" style={{marginBottom: 7, borderBottom: '1px solid lightgray'}}>Your Reviews</Row>
        {reviews.length > 0 ? 
        <ReviewsListProfile reviews={reviews} numberOfReviews={reviews.length} setReviews={setReviews} restaurant={restaurant}/> 
        : 
        <Row as="h6" className="text-secondary">You haven't written any reviews yet</Row>
        }
      </Col>
      </Container>
    );
}

const RestaurantManagement = (props) => {  {/*ME LO PASSA GAETANO*/}
    const [showModal, setShowModal] = useState(false);
    const { restaurant, setRestaurant } = props;
    const navigate = useNavigate();

    const handleRemoveRestaurant= () => {
      setShowModal(true);
    };

    const removeRestaurant = () => {
        //const emptyRestaurant = props.restaurant.filter((_, i) => i !== index);
        setRestaurant(null); //SIAMO CERTI CHE C'è UN SOLO RISTORANTE, QUINDI BASTA FARE QUESTO PER RIMUOVERLO
    };

    return (
      <Container fluid>  
          <Col className="mb-2" style={{marginTop: 40}}>
            <Row as="h1" style={{marginBottom: 14, borderBottom: '1px solid lightgray'}}>Your Restaurant</Row>
            <Row className="text-secondary">
            {(restaurant == null) ? <Row as="h6" className="text-secondary">You don't have a page for your restaurant</Row> : <BannerProfile restaurant={restaurant}/>}
            {(restaurant == null) ? 
            <Button variant="primary" onClick={() => {navigate(`/addInfo`)}} style={{marginTop: 20}}>Create a restaurant page</Button>
            : 
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 20}}>
                <Button variant="primary" onClick={() => {navigate(`/editInfo/${1}/`)}}>Edit</Button>
                <Button variant="danger" onClick={() => handleRemoveRestaurant(restaurant.id)}>Delete</Button>
            </div>
            }
            </Row>
          </Col>
        <ConfirmModal text={'Delete this Restaurant'} show={showModal} setShow={setShowModal} action={removeRestaurant}/>
      </Container>
    );
}

function Profile(props) {
    const [address, setAddress] = useState({ text: '', lat: 0.0, lng: 0.0, invalid: false });

    const { id } = useParams();
    const username = 'Luca';
    const [reviews, setReviews] = useState([]);
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        const getRestaurant = async () => {
            try {
                const restaurant = await API.getRestaurant(1);
                console.log(restaurant);
                setRestaurant(restaurant);
            } catch (error) {
                console.log(error);
            }
        }

        getRestaurant();
    }, [id]);

    useEffect(() => {
      const getReviewsByUser = async () => {
        try {
            const reviews = await API.getReviewsByUser(username);
            console.log(reviews);
            setReviews(reviews);

        } catch (error) {
            console.log(error);
        }
      }

      getReviewsByUser();
  }, [username]);

    return (
        <>
          <Col style={{marginTop: 15, marginLeft: 24, marginRight: 24}}>
            <ProfileHeader selectedStatus={props.selectedStatus} setSelectedStatus={props.setSelectedStatus}/>
            <ProfileInformation address={address} setAddress={setAddress}/> 
            <ReviewRow reviews={reviews} setReviews={setReviews} restaurant={restaurant}/>
            {props.selectedStatus != "User" ? <RestaurantManagement restaurant={restaurant} setRestaurant={setRestaurant}/> : <></>}
          </Col>
        </>
    );
}
export { Profile };
