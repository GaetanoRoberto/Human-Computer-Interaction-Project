import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react'
import { Home } from './components/Home'
import { BrowserRouter,Routes,Route,Navigate,Link } from 'react-router-dom' ;
import { Restaurant } from './components/Restaurant';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<></>}/>
        <Route path='/filters' element={<></>}/>
        <Route path='/settings' element={<></>}/>
        <Route path='/restaurants/:id/details' element={<Restaurant/>}/>
        <Route path='/restaurants/:id/menu' element={<Restaurant/>}/>
        <Route path='/restaurants/:id/reviews' element={<Restaurant/>}/>
        {/*POP UP DI ALE COSTA <Route path='/restaurants/:id/menu/ingredients/:id' element={<></>}/>*/}
        <Route path='/addInfo' element={<></>}/>
        <Route path='/editInfo/:id' element={<></>}/>
        <Route path='/addDish' element={<></>}/>
        <Route path='/editDish/:id' element={<></>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
