import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
const libraries = ['places']; // Define libraries outside the component (for address field)
import { LoadScript } from '@react-google-maps/api';
import { API_KEY } from './components/Costants.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <App />
    </LoadScript>
  </React.StrictMode>,
)
