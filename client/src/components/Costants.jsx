// base server url from which call the client API
const SERVER_URL = 'http://localhost:3001/api';

// image base path from which retrieve the images of dish from the server
const DISHES_PATH = 'http://localhost:3001/dishes/';

// image base path from which retrieve the images of dish from the server
const RESTAURANTS_PATH = 'http://localhost:3001/restaurants/';

// placeholder if no image is provided
const PLACEHOLDER = 'http://localhost:3001/placeholder.png';

// API KEY for google maps address
const API_KEY = 'AIzaSyCvuhhqU5FKKc39jRLY1pviZAzcKeNLJdc';

// possible filters to apply/categories to enter when adding or editing a restaurant
const FILTERS = [];

// days of the week
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fry", "Sat", "Sun"];

export{SERVER_URL,DISHES_PATH,RESTAURANTS_PATH,PLACEHOLDER,API_KEY,DAYS};