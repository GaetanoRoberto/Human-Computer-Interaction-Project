import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react'
import { Home } from './components/Home'
import { BrowserRouter,Routes,Route,Navigate,Link } from 'react-router-dom' ;
import { Restaurant } from './components/Restaurant';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
library.add(fab, fas, far);


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>     {/* FATTA*/ }
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
