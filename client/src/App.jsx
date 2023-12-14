import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react'
import { Home } from './components/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
      <Home/>
  )
}

export default App
