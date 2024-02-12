import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Home } from './components/Home'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuinscape, fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { Reviews } from './components/ReviewsList';
import { ReviewForm } from './components/ReviewPage';
import { useState, useEffect,useContext } from 'react';
import { RestaurantForm } from './components/RestaurantForm';
import { Restaurant } from "./components/Restaurant.jsx";
import { ErrorContext, UserContext } from './components/userContext';
import { Button, Col, Alert, Toast } from 'react-bootstrap';
import { Profile } from './components/Profile';
import { DishForm } from './components/DishForm';
import { FilterPage } from './components/FilterPage.jsx';
import API from './API';
// import ErrorComponent from './components/ErrorComponent.jsx';
import { Header } from './components/Home';
import {DishIngredientsView} from "./components/DishIngredientsView.jsx";
library.add(fab, fas, far);
 

function App() {
  const [user, setUser] = useState(null);
  const username = user && user.username;
  // const [loggedIn, setLoggedIn] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('User'); //User: Default selection, Restaurater
  const [address, setAddress] = useState({ text: '', lat: 0.0, lng: 0.0, invalid: false });
  const [filtersToApply, setFiltersToApply] = useState({
    categories: [],
    priceRange: [0, 50],
    qualityRating: '',
    safetyRating: '', 
    allergens: [], // Array to hold added ingredients
    openNow: false,
    distance: false,
    // label: "Nothing",
    // order: "DESC"
  });
  const [categoriesOptions, setCategoriesOptions] = useState([{ value: '', label: '' }]);
  const [allergensOptions, setAllergensOptions] = useState([{ value: '', label: '' }]);
  // Restaurant Form State
  const [progress, setProgress] = useState(1);
  // Home Search bar
  const [search, setSearch] = useState("");
  // Allergens state
  const [restaurantAllergens, setRestaurantAllergens] = useState([]);
  // Menu category state
  const [menuType, setMenuType] = useState([]);
  const [divHeight, setDivHeight] = useState(null);


  // Define doLogIn function outside of useEffect
  const doLogIn = () => {
    const credentials = {
      username: selectedStatus == "User" ? "User" : "Restaurateur",
      isRestaurateur: selectedStatus == "User" ? "0" : "1",
      position: ""
      
      //isRestaurateur: selectedStatus == "User" ? 0 : 1,
    };
    API.logIn(credentials)
      .then(user => {
        setUser(user);
        //console.log("Login successful with user:", user);
      })
      .catch(err => {
        handleError({error: `Login failed with error: ${err.error}`});
      });
  };

  // error state for handling errors, shared with context
  const [errorMessage, setErrorMessage] = useState('');

  // function to handle the application errors
  function handleError(err) {
    let errMsg = 'Unknown error';
    if (err.error) {
      errMsg = err.error;
    }

    setErrorMessage(errMsg);
  }
  //Gaetano 
  /*
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // se sono già loggato prendo info
        const user = await API.getUserInfo();
         console.log("già autenticato", user)
        // setLoggedIn(true);
        setUser(user);
      } catch (err) {
        // console.log("Utente non autenticato. Effettua il login.");
        // Effettua il login se l'utente non è autenticato
        doLogIn();
        return
      }};
    checkAuth();
    }, []);
    const doLogIn = () => {
      const credentials = {
        username: "Andrea",
        isRestaurateur: "0"
      }
      /*
      const credentials = {
        username: "Restaurateur",
        isRestaurateur: "1"
      }
      API.logIn(credentials)
        .then(user => {
          setUser(user);
          console.log("autenticazione in corso",user)
        })
        .catch(err => {
          handleError(err);
          console.log(err)
        })
    }*/
  //Davide

  useEffect(() => {
    // Function to check current authentication status
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        if(user.isRestaurateur == "1"){
          setSelectedStatus("Restaurateur");
        } else {
          setSelectedStatus("User");
        }
      } catch (err) {
        console.log(err)
        doLogIn(); // Attempt login if not authenticated
      }
    };

    if (user) {
      handleLogout()
      doLogIn();
    } else {
      checkAuth();
    }
  }, [selectedStatus]); // Only runs once on component mount

  /*
    useEffect(() => {
      // Perform login whenever selectedStatus changes
  
    }, []);*/

  const handleLogout = async () => {
    await API.logOut().catch((err) => handleError(err));
    setUser(undefined);
  }

  useEffect(() => {
    // function used to retrieve restaurant information in detail
    async function getUser(username) {
        try {
            const user1 = await API.getUser(username);
            if (user1 != null) {
                setAddress({ text: user1.position.split(";")[0], lat: user1.position.split(";")[1], lng: user1.position.split(";")[2], invalid: false });
                //console.log(user);
            } else {
                // Handle the case when the user is not found
                handleError({error: 'User not found'});
            }
        } catch (err) {
            // show error message
            console.log(err);
        }
    };
    if (username) {
        getUser(username);
    }
  }, [username]);

  return (
    <UserContext.Provider value={user}>
      <ErrorContext.Provider value={handleError}>
        <BrowserRouter>
          <Header selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} handleLogout={handleLogout} doLogIn={doLogIn} />
          {errorMessage ?
            <Toast  show={errorMessage !== ''} onClose={() => setErrorMessage('')} delay={6000} autohide bg="danger w-100">
              <Toast.Body>{errorMessage}</Toast.Body>
            </Toast>
            : ' '}
          {/*<Alert style={{marginBottom:'0px'}} variant='danger' dismissible onClick={() => setErrorMessage('')} >{errorMessage}</Alert>*/}
          <Routes>
            <Route path='/' element={<Home filtersToApply={filtersToApply} setFiltersToApply={setFiltersToApply} search={search} setSearch={setSearch} setRestaurantAllergens={setRestaurantAllergens} setMenuType={setMenuType} />} />     {/* FATTA*/}
            <Route path='/filters' element={<FilterPage filtersToApply={filtersToApply} setFiltersToApply={setFiltersToApply} address={address} setAddress={setAddress} selectedStatus={selectedStatus} categoriesOptions={categoriesOptions} setCategoriesOptions={setCategoriesOptions} allergensOptions={allergensOptions} setAllergensOptions={setAllergensOptions}/>} />{/* DAVE [o chi finisce prima] */}
            <Route path='/settings' element={<Profile user={user} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} address={address} setAddress={setAddress} setProgress={setProgress} setDivHeight={setDivHeight}/>} />{/* DAVE*/}
            <Route path='/restaurants/:id/details' element={<Restaurant restaurantAllergens={restaurantAllergens} setRestaurantAllergens={setRestaurantAllergens} menuType={menuType} divHeight={divHeight} setDivHeight={setDivHeight}/>} />{/* QUEEN*/}
            <Route path='/restaurants/:id/menu' element={<Restaurant restaurantAllergens={restaurantAllergens} setRestaurantAllergens={setRestaurantAllergens} menuType={menuType} divHeight={divHeight} setDivHeight={setDivHeight}/>} />{/* QUEEN*/}
            <Route path='/restaurants/:id/menu/dish/:dishId' element={<DishIngredientsView />} />{/* QUEEN*/}
            <Route path='/restaurants/:id/reviews' element={<Restaurant restaurantAllergens={restaurantAllergens} setRestaurantAllergens={setRestaurantAllergens} menuType={menuType} divHeight={divHeight} setDivHeight={setDivHeight}/>} />{/* TANUCC*/}
            <Route path='/restaurants/:id/reviews/add' element={<ReviewForm />} />{/* TANUCC*/}
            <Route path='/restaurants/:id/reviews/edit/:reviewId' element={<ReviewForm />} />{/* TANUCC*/}
            <Route path='/restaurants/:id/reviews/:reviewId' element={<ReviewForm />} />{/* TANUCC*/}
            <Route path='/addInfo' element={selectedStatus == "Restaurateur" ? <RestaurantForm progress={progress} setProgress={setProgress} /> : <DefaultRoute />} />  {/* DOME*/}
            <Route path='/editInfo/:id' element={selectedStatus == "Restaurateur" ? <RestaurantForm progress={progress} setProgress={setProgress} /> : <DefaultRoute />} />{/* DOME*/}
            <Route path='*' element={<DefaultRoute />} />
          </Routes>
        </BrowserRouter>
      </ErrorContext.Provider>
    </UserContext.Provider>

  )
}

function DefaultRoute() {

  return (
    <div style={styles.centered}>
      <Col>
        <h1>You shouldn’t be here...</h1>
        <p>Wrong URL!</p>
        <Link to="/">
          <Button type="button" variant="success" className="btn btn-lg edit-button">Go back to the homepage</Button>
        </Link>
      </Col>
    </div>
  );
}

const styles = {
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center the content horizontally
    height: '100vh', // Set to 100% of the viewport height
  },
};

export default App;
