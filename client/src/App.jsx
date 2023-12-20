import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState,useEffect } from 'react'
import API from './API'
import { Home } from './components/Home'
import { BrowserRouter,Routes,Route,Navigate,Link } from 'react-router-dom' ;
import { Restaurant } from './components/Restaurant';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faQuinscape, fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
library.add(fab, fas, far);


function App() {
  const [restaurantList, setrestaurantList] = useState([]);
  const [filters,setFilters] = useState([]);

  useEffect(() => {
    async function getRestaurants() {
      try {
        const restaurants = await API.getRestaurants();
        setrestaurantList(restaurants);
      } catch (error) {
        console.log(error);
      }
    };
    async function getFilters() {
      try {
        const filters = await API.getFilters();
        setFilters(filters);
      } catch (error) {
        console.log(error);
      }
    };

    getRestaurants();
    getFilters();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home restaurants={restaurantList} filters={filters} setFilters={setFilters}/>}/>     {/* FATTA*/ }
        <Route path='/login' element={<></>}/>  {/* TANUCC*/ }
        <Route path='/filters' element={<></>}/>{/* DAVE [o chi finisce prima] */ }
        <Route path='/settings' element={<></>}/>{/* DAVE*/ }
        <Route path='/restaurants/:id/details' element={<Restaurant/>}/>{/* QUEEN*/ }
        <Route path='/restaurants/:id/menu' element={<Restaurant/>}/>{/* QUEEN*/ }
        <Route path='/restaurants/:id/reviews' element={<Restaurant/>}/>{/* TANUCC*/ }
        <Route path='/restaurants/:id/reviews/add' element={<Restaurant/>}/>{/* TANUCC*/ }
        {/*POP UP DI ALE COSTA <Route path='/restaurants/:id/menu/ingredients/:id' element={<></>}/>*/} {/* QUEEN*/ }
        <Route path='/addInfo' element={<></>}/>  {/* DOME*/ }
        <Route path='/editInfo/:id' element={<></>}/>{/* DOME*/ }
        <Route path='/addDish' element={<></>}/>{/*   DAVE*/ }
        <Route path='/editDish/:id' element={<></>}/>{/* DAVE*/ }
      </Routes>
    </BrowserRouter>
  )
}

export default App
