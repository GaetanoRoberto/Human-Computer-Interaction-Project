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
import { useState, useEffect } from 'react';
import { RestaurantForm } from './components/RestaurantForm';
import { Restaurant } from "./components/Restaurant.jsx";
import { ErrorContext, UserContext } from './components/userContext';
import { Button, Col, Alert } from 'react-bootstrap';
import { Profile } from './components/Profile';
import { DishForm } from './components/DishForm';
import { FilterPage } from './components/FilterPage.jsx';
import API from './API';
import { Header } from './components/Home';
library.add(fab, fas, far);


function App() {
  const [user, setUser] = useState(null);
  // const [loggedIn, setLoggedIn] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Restaurater'); //User: Default selection, Restaurater
  const [filters, setFilters] = useState({
    categories: [],
    minprice: '',
    maxprice: '',
    maxDistance: '',
    qualityRating: '',
    safetyRating: '', 
    ingredientInput: '',
    ingredients: [], // Array to hold added ingredients
    openNow: false,
  });
  const [isInvalidIngredient, setIsInvalidIngredient] = useState(false);
  const [isInvalidPrice, setIsInvalidPrice] = useState(false);



  // Define doLogIn function outside of useEffect
  const doLogIn = () => {
    const credentials = {
      username: selectedStatus == "Restaurater" ? "Restaurateur" : "Luca", 
      isRestaurateur: selectedStatus == "Restaurater" ? "1" : "0",
    };
    API.logIn(credentials)
      .then(user => {
        setUser(user);
        console.log("Login successful with user:", user);
      })
      .catch(err => {
        console.error("Login failed with error:", err);
      });
  };

  // error state for handling errors, shared with context
  const [errorMessage,setErrorMessage] = useState('');

  // function to handle the application errors
  function handleError(err) {
    let errMsg = 'Unkwnown error';
    if (err.error) {
      errMsg = err.error;
    }

    setErrorMessage(errMsg);
  }

  useEffect(() => {
    // Function to check current authentication status
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
      } catch (err) {
        doLogIn(); // Attempt login if not authenticated
      }
    };
    checkAuth();
  }, [selectedStatus]); // Only runs once on component mount

  useEffect(() => {
    // Perform login whenever selectedStatus changes
    doLogIn(); 
  }, [selectedStatus]);

  const handleLogout = async () => {
    await API.logOut().catch((err) => handleError(err));
    setUser(undefined);
  }

  return (
    <UserContext.Provider value={user}>
      <ErrorContext.Provider value={handleError}>
        <BrowserRouter>
          <Header selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} handleLogout={handleLogout} doLogIn={doLogIn}/>
          {errorMessage ? <Alert style={{marginBottom:'0px'}} variant='danger' dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
          <Routes>
            <Route path='/' element={<Home />} />     {/* FATTA*/}
            <Route path='/filters' element={<FilterPage filters={filters} setFilters={setFilters} isInvalidPrice={isInvalidPrice} setIsInvalidPrice={setIsInvalidPrice} isInvalidIngredient={isInvalidIngredient} setIsInvalidIngredient={setIsInvalidIngredient}/>} />{/* DAVE [o chi finisce prima] */}
            <Route path='/settings' element={<Profile user={user} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} handleLogout={handleLogout} doLogIn={doLogIn} />} />{/* DAVE*/}
            <Route path='/restaurants/:id/details' element={<Restaurant />} />{/* QUEEN*/}
            <Route path='/restaurants/:id/menu' element={<Restaurant />} />{/* QUEEN*/}
            <Route path='/restaurants/:id/reviews' element={<Restaurant />} />{/* TANUCC*/}
            <Route path='/restaurants/:id/reviews/add' element={<ReviewForm />} />{/* TANUCC*/}
            <Route path='/restaurants/:id/reviews/edit/:reviewId' element={<ReviewForm />} />{/* TANUCC*/}
            <Route path='/restaurants/:id/reviews/:reviewId' element={<ReviewForm />} />{/* TANUCC*/}
            <Route path='/addInfo' element={<RestaurantForm />} />  {/* DOME*/}
            <Route path='/editInfo/:id' element={<RestaurantForm />} />{/* DOME*/}
            {selectedStatus == "Restaurater" && <Route path='/addDish' element={<DishForm />} />}   {/*   DAVE*/}
            <Route path='/editDish/:restaurantId/:dishId' element={<DishForm/>} />{/* DAVE*/}
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
        <h1>Nothing here...</h1>
        <p>This is not the route you are looking for!</p>
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
