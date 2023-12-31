import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Home } from './components/Home'
import { BrowserRouter,Routes,Route,Navigate,Link } from 'react-router-dom' ;
import {library} from '@fortawesome/fontawesome-svg-core';
import {faQuinscape, fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import { Reviews } from './components/ReviewsList';
import { ReviewForm } from './components/ReviewPage';
import { useState,useEffect } from 'react';
import { RestaurantForm } from './components/RestaurantForm';
import { UserContext } from './components/userContext';
import API from './API';
library.add(fab, fas, far);


function App() {
  const [user, setUser] = useState(null);
 // const [loggedIn, setLoggedIn] = useState(false);


  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // se sono già loggato prendo info
        const user = await API.getUserInfo();
        console.log("già autenticato", user)
        //setLoggedIn(true);
        setUser(user);
      } catch (err) {
        console.log("Utente non autenticato. Effettua il login.");
        // Effettua il login se l'utente non è autenticato
        doLogIn();
        return
      }
    };
    checkAuth();
    
  }, []);
  const doLogIn = (credentials) => {
    credentials={
      "username": "User",
      "isRestaurateur": 0
    }
    /*
    credentials={
      "username": "Restaurateur",
      "isRestaurateur": 1
    }*/
    API.logIn(credentials)
      .then( user => {
        setUser(user);
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleLogout = async () => {
    await API.logOut().catch((err) => console.log(err));
    setUser(undefined);
  }
  return (
    <UserContext.Provider value={user}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>     {/* FATTA*/ }
        <Route path='/login' element={<></>}/>  {/* TANUCC*/ }
        <Route path='/filters' element={<></>}/>{/* DAVE [o chi finisce prima] */ }
        <Route path='/settings' element={<></>}/>{/* DAVE*/ }
        <Route path='/restaurants/:id/details' element={<RestaurantForm/>}/>{/* QUEEN*/ }
        <Route path='/restaurants/:id/menu' element={<RestaurantForm/>}/>{/* QUEEN*/ }
        <Route path='/restaurants/:id/reviews' element={<Reviews/>}/>{/* TANUCC*/ }
        <Route path='/restaurants/:id/reviews/add' element={<ReviewForm/>}/>{/* TANUCC*/ }
        <Route path='/restaurants/:id/reviews/edit/:reviewId' element={<ReviewForm/>}/>{/* TANUCC*/ }
        <Route path='/restaurants/:id/reviews/:reviewId' element={<ReviewForm/>}/>{/* TANUCC*/ }
        {/*POP UP DI ALE COSTA <Route path='/restaurants/:id/menu/ingredients/:id' element={<></>}/>*/} {/* QUEEN*/ }
        <Route path='/addInfo' element={<RestaurantForm/>}/>  {/* DOME*/ }
        <Route path='/editInfo/:id' element={<RestaurantForm/>}/>{/* DOME*/ }
        <Route path='/addDish' element={<></>}/>{/*   DAVE*/ }
        <Route path='/editDish/:id' element={<></>}/>{/* DAVE*/ }
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>

  )
}

export default App
