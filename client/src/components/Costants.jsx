const HTTP_AND_IP_ADDRESS_AND_PORT = "http://192.168.1.8:3001"; //SOSTITUIRE 192.168.0.100 CON L'INDIRIZZO IP DELLA PROPRIA INTERFACCIA DI RETE WIFI e LASCIARE LA PORTA DEL SERVER (3001)  --> N.B.: L'INTERFACCIA DI RETE ETHERNET AVRà UN IP ADDRESS DIVERSO! (TIPICAMENTE QUELLO ETHERNET è IL 2O IP CHE CI VIENE DATO QUANDO SI RUNNA IL CLIENT DI UNA REACT APP, MENTRE QUELLO WIFI è IL 3O IP CHE CI VIENE DATO)
// base server url from which call the client API
const SERVER_URL = HTTP_AND_IP_ADDRESS_AND_PORT + '/api';

// image base path from which retrieve the images of dish from the server
const DISHES_PATH = HTTP_AND_IP_ADDRESS_AND_PORT + '/dishes/';

// image base path from which retrieve the images of dish from the server
const RESTAURANTS_PATH = HTTP_AND_IP_ADDRESS_AND_PORT + '/restaurants/';

// placeholder if no image is provided
const PLACEHOLDER = HTTP_AND_IP_ADDRESS_AND_PORT + '/placeholder.png';
const PLACEHOLDER2 = HTTP_AND_IP_ADDRESS_AND_PORT + '/placeholder2.png';

// API KEY for google maps address
const API_KEY = 'AIzaSyCvuhhqU5FKKc39jRLY1pviZAzcKeNLJdc';

// possible filters to apply/categories to enter when adding or editing a restaurant
const FILTERS = [];

// days of the week
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fry", "Sat", "Sun"];

// Allergens
const foodAllergens = ['Peanuts', 'Tree nuts', 'Lactose', 'Eggs', 'Soy', 'Gluten', 'Fish', 'Shellfish', 'Sesame seeds', 'Mustard', 'Celery', 'Sulphites', 'Lupin', 'Mollusks', 'Kiwi', 'Mango', 'Pineapple', 'Papaya', 'Avocado', 'Banana', 'Strawberry', 'Tomato', 'Bell peppers', 'Garlic', 'Onion', 'Carrot', 'Peach', 'Plum', 'Melons', 'Berries'].map(item => ({ value: item.toLowerCase(), label: item.toLowerCase() }));

export{SERVER_URL,DISHES_PATH,RESTAURANTS_PATH,PLACEHOLDER,PLACEHOLDER2,API_KEY,DAYS,foodAllergens};