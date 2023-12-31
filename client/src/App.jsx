import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Home } from './components/Home'
import { BrowserRouter,Routes,Route,Navigate,Link } from 'react-router-dom' ;
import { NavigationButtons } from './components/NavigationButtons';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faQuinscape, fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import { Login } from './components/login';
import { Reviews } from './components/ReviewsList';
import { ReviewForm } from './components/ReviewPage';

import { RestaurantForm } from './components/RestaurantForm';
library.add(fab, fas, far);


function App() {

  return (
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
        {/*POP UP DI ALE COSTA <Route path='/restaurants/:id/menu/ingredients/:id' element={<></>}/>*/} {/* QUEEN*/ }
        <Route path='/addInfo' element={<RestaurantForm/>}/>  {/* DOME*/ }
        <Route path='/editInfo/:id' element={<RestaurantForm/>}/>{/* DOME*/ }
        <Route path='/addDish' element={<></>}/>{/*   DAVE*/ }
        <Route path='/editDish/:id' element={<></>}/>{/* DAVE*/ }
      </Routes>
    </BrowserRouter>
  )
}

export default App
