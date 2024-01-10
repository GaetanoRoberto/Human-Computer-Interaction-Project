import { useState, useEffect } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import API from "../API.jsx";
import '../index.css' 
import { AddressSelector } from './RestaurantFormUtility';
import { ReviewsListProfile } from './ReviewsListProfile';
import { BannerProfile } from './Restaurant';
import { Header } from './Header.jsx';
import ConfirmModal from './ConfirmModal';
import { address_object_to_string } from './RestaurantFormUtility';

function MyLocation(props) {
  const { address, setAddress, username } = props;

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

      geocoder.geocode({ location: latLng }, async (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results[0]) {
              setAddress({ text: results[0].formatted_address, lat: latitude, lng: longitude, invalid: false });

              const location = results[0].formatted_address + ';lat:' + latitude + ";lng:" + longitude;
              const updatedUser = { 
                position: location, 
                isRestaurateur: 1, 
                username: "Restaurateur"
              };
              console.log(updatedUser);

              // Now call the updateUser API with the updated user information
              try {
                await API.updateUser(updatedUser); // Assuming updateUser returns a promise
                resolve(updatedUser); // Resolve with undefined for a valid address
              } catch(error) {
                console.error("Failed to update user:", error);
                reject(error); // Reject with the error
              }
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
                {props.username}
            </Row>
          </Col>
          <Col className="mb-2" style={{marginTop: 40}}>
            <Row as="h1" style={{marginTop: 30, marginBottom: 14.1, borderBottom: '1px solid lightgray'}}>Enter Your Location</Row>
            <Row style={{marginLeft: "-22.5px"}}>
            <AddressSelector address={props.address} setAddress={props.setAddress} isInProfilePage={true}/>
            <MyLocation address={props.address} setAddress={props.setAddress} username={props.username}/>
            </Row>
          </Col>
        </Container>
      </>
      );
}

const ReviewRow = (props) => {  {/*ME LO PASSA GAETANO*/}
    const { reviews, setReviews, restaurant } = props;

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

    const removeRestaurant = async () => {
      try {
          await API.deleteRestaurant(1); 
          setRestaurant(null); 
      } catch (error) {
          console.error("Failed to delete the restaurant:", error);
      }
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
    const username = "Restaurateur";
    const [reviews, setReviews] = useState([]);
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
      // function used to retrieve restaurant information in detail
      async function getUser(username) {
          try {
              const user = await API.getUser(username);
              if (user != null) {
                  setAddress({ text: user.position.split(";")[0], lat: user.position.split(";")[1], lng: user.position.split(";")[2], invalid: false });
                  //console.log(user);
              } else {
                  // Handle the case when the dish with dishId is not found
                  console.log('User not found');
              }
          } catch (err) {
              // show error message
              console.log(err);
          }
      };
      if (username) {
          getUser(username);
      }
    }, []);

    
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

    useEffect(() => {
        const getInsertedRestaurant = async () => {
            try {
                const restaurant = await API.getInsertedRestaurant();
                //console.log(restaurant);
                if (restaurant.error == "Restaurant not found."){
                  setRestaurant(null);
                } else {
                  setRestaurant(restaurant);
                }
            } catch (error) {
                console.log(error);
            }
        }

        getInsertedRestaurant();
    }, []);

    return (
        <>
          <Col style={{marginTop: 15, marginLeft: 24, marginRight: 24}}>
            <ProfileInformation address={address} setAddress={setAddress} username={username}/> 
            <ReviewRow reviews={reviews} setReviews={setReviews} restaurant={restaurant}/>
            {props.selectedStatus != "User" ? <RestaurantManagement restaurant={restaurant} setRestaurant={setRestaurant}/> : <></>}
          </Col>
        </>
    );
}
export { Profile };
