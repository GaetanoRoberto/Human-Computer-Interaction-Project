import { useState, useEffect, useRef, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "../API.jsx";
import '../index.css'
import { AddressSelector } from './RestaurantFormUtility';
import { ReviewsListProfile } from './ReviewsListProfile';
import { Banner } from './Restaurant';
import { Header } from './Header.jsx';
import ConfirmModal from './ConfirmModal';
import { address_object_to_string } from './RestaurantFormUtility';
import { UserContext, ErrorContext } from './userContext';

function MyLocation(props) {
  const handleError = useContext(ErrorContext);
  const { address, setAddress, username, selectedStatus } = props;
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  function handleLocationClick() {
    setIsLoadingLocation(true);
    setTimeout(async () => {
      setIsLoadingLocation(false);
      setAddress({ text: 'Corso Castelfidardo, 10138 Torino TO', lat: 45.0651431, lng: 7.6584808, invalid: false });
      const location = 'Corso Castelfidardo, 10138 Torino TO' + ';lat:' + '45.0651431' + ";lng:" + '7.6584808';
      const updatedUser = {
        position: location,
        isRestaurateur: selectedStatus == "User" ? 0 : 1,
        username: selectedStatus == "User" ? "User" : "Restaurateur",
      };
      try {
        await API.updateUser(updatedUser);
      } catch (error) {
        handleError({ error: `Unable to retrieve your location` });
      }
    }, 3000);
    /*if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
    } else {
      //console.log("Geolocation not supported");
      setIsLoadingLocation(false);
    }*/
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
            isRestaurateur: selectedStatus == "User" ? 0 : 1,
            username: selectedStatus == "User" ? "User" : "Restaurateur",
          };
          //console.log(updatedUser);

          // Now call the updateUser API with the updated user information
          try {
            await API.updateUser(updatedUser); // Assuming updateUser returns a promise
            resolve(updatedUser); // Resolve with undefined for a valid address
          } catch (error) {
            //console.error("Failed to update user:", error);
            reject(error); // Reject with the error
          }
        } else {
          setAddress({ text: results[0].formatted_address, lat: latitude, lng: longitude, invalid: true });
          reject(true); // Resolve with true for an invalid address
          //reject('Geocode was not successful for the following reason: ' + status);
        }
      });
    }).finally(() => {
      setIsLoadingLocation(false); // Set loading state to false when the geocoding is complete
    });
  }

  function error(err) {
    setIsLoadingLocation(true); // Assuming you want to show loading before the error

    // Simulate 1 second loading before showing the error
    setTimeout(() => {
      setIsLoadingLocation(false);
      handleError({ error: `Unable to retrieve your location` });
    }, 1000); // 1000 milliseconds = 1 second
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Button className='light-green' onClick={handleLocationClick} style={{ width: '330px', marginTop: 10 }}>
        {isLoadingLocation ?
          <FontAwesomeIcon icon="fas fa-spinner" spin style={{ "marginRight": 10 }} /> :
          <><FontAwesomeIcon icon="fas fa-map-marker-alt" style={{ "marginRight": 10 }} />Use your GPS</>
        }
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
        <Col className="mb-2" style={{ marginTop: 15 }}>
          <Row as="h2">Your Username:</Row>
          <Row as="h4" className="text-secondary">
            {props.selectedStatus}
          </Row>
        </Col>
        <Col className="mb-2" style={{ marginTop: 35 }}>
          <Row as="h2" style={{ marginTop: 30, marginBottom: 14.1 }}>Enter Your Location:</Row>
          <Row style={{ marginLeft: "-22.5px" }}>
            <AddressSelector address={props.address} setAddress={props.setAddress} isInProfilePage={true} selectedStatus={props.selectedStatus}/>
            <MyLocation address={props.address} setAddress={props.setAddress} username={props.username} selectedStatus={props.selectedStatus} />
          </Row>
        </Col>
      </Container>
    </>
  );
}

const ReviewRow = (props) => {
  {/*ME LO PASSA GAETANO*/ }
  const { reviews, setReviews, restaurant } = props;

  return (
    <Container fluid>
      <Col className="mb-2" style={{ marginTop: 35 }}>
        <Row as="h2" style={{ marginBottom: 7 }}>Your Reviews: ({reviews.length})</Row>
        {reviews.length > 0 ?
          <ReviewsListProfile reviews={reviews} numberOfReviews={reviews.length} setReviews={setReviews} restaurant={restaurant} />
          :
          <Row as="h6" className="text-secondary">You haven't written any reviews yet</Row>
        }
      </Col>
    </Container>
  );
}

const RestaurantManagement = (props) => {
  {/*ME LO PASSA GAETANO*/ }
  const handleError = useContext(ErrorContext);
  const bannerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const { restaurant, setRestaurant, setProgress } = props;
  const navigate = useNavigate();

  const handleRemoveRestaurant = () => {
    setShowModal(true);
  };

  const removeRestaurant = async () => {
    try {
      await API.deleteRestaurant(restaurant.id);
      setRestaurant(null);
    } catch (error) {
      handleError({ error: `Failed to delete the restaurant:${error.error}` });
    }
  };

  return (
    <Container fluid>
      <Col className="mb-2" style={{ marginTop: 35 }}>
        <Row as="h2" style={{ marginBottom: 14 }}>Your Restaurant:</Row>
        <Row className="text-secondary">
        {(restaurant == null) ? <Row as="h6" className="text-secondary">You don't have a page for your restaurant.</Row> : <Banner restaurant={restaurant} bannerRef={bannerRef} setDivHeight={props.setDivHeight} isInProfile={true}/>}
          {(restaurant == null) ?
            <Col style={{textAlign:'center'}}>
              <Button variant="success" onClick={() => { navigate(`/addInfo`); setProgress(1); }} style={{ width: '330px', marginTop: 20 }}>Create a Restaurant Page</Button>
            </Col>
            :
            <Container>
              <Row style={{ textAlign: 'center' }}>
                <Col>
                  <Button variant="success" style={{ marginTop: "20px", marginBottom: "20px", width: '140px' }} onClick={() => { navigate(`/editInfo/${restaurant.id}/`); setProgress(1); }}>Edit Info</Button>
                </Col>
                <Col>
                  <Button variant="success" style={{ marginTop: "20px", marginBottom: "20px", width: '140px' }} onClick={() => { navigate(`/editInfo/${restaurant.id}/`, { state: { from: 'edit_menu' } }); setProgress(4); }}>Edit Menu</Button>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: 'center' }}>
                  <Button variant="danger" style={{ width: '330px' }} onClick={() => { handleRemoveRestaurant(restaurant.id); setProgress(1); }}>Delete</Button>
                </Col>
              </Row>
            </Container>
          }
        </Row>
      </Col>
      <ConfirmModal text={'Delete this Restaurant'} show={showModal} setShow={setShowModal} action={removeRestaurant} />
    </Container>
  );
}

function Profile(props) {
  const handleError = useContext(ErrorContext);
  const user = useContext(UserContext);
  const username = user && user.username;
  const isRestaurateur = user && user.isRestaurateur; //se è definito prendo isRestaurater
  const [reviews, setReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const { setProgress } = props;

  useEffect(() => {
    // function used to retrieve restaurant information in detail
    async function getUser(username) {
      try {
        const user1 = await API.getUser(username);
        if (user1 != null) {
          props.setAddress({ text: user1.position.split(";")[0], lat: user1.position.split(";")[1], lng: user1.position.split(";")[2], invalid: false });
          //console.log(user);
        } else {
          // Handle the case when the dish with dishId is not found
          handleError({ error: 'User not found' });
        }
      } catch (err) {
        // show error message
        handleError(err);
      }
    };
    if (username) {
      getUser(username);
    }
  }, [username, location.key]);


  useEffect(() => {
    const getReviewsByUser = async () => {
      try {
        const reviews = await API.getReviewsByUser(props.selectedStatus);
        //console.log(reviews);
        setReviews(reviews);

      } catch (error) {
        handleError(error);
      }
    }

    getReviewsByUser();
  }, [username]);

  useEffect(() => {
    const getInsertedRestaurant = async () => {
      try {
        const restaurant = await API.getInsertedRestaurant();
        //console.log(restaurant);
        if (restaurant.error == "Restaurant not found.") {
          setRestaurant(null);
        } else {
          setRestaurant(restaurant);
        }
      } catch (error) {
        handleError(error);
      }
    }

    getInsertedRestaurant();
  }, [username]);

  return (
    <>
      <Container fluid style={{ height: window.innerHeight - 70, overflowY: 'auto', marginBottom: '3%' }}>
        <ProfileInformation address={props.address} setAddress={props.setAddress} username={username} selectedStatus={props.selectedStatus} />
        {props.selectedStatus == "Restaurateur" ? <RestaurantManagement restaurant={restaurant} setRestaurant={setRestaurant} setProgress={setProgress} setDivHeight={props.setDivHeight}/> : <></>}
        <ReviewRow reviews={reviews} setReviews={setReviews} restaurant={restaurant} />
      </Container>
    </>
  );
}
export { Profile };
