const HTTP_AND_IP_ADDRESS_AND_PORT = "http://172.22.156.23:3001"; //SOSTITUIRE 192.168.0.100 CON L'INDIRIZZO IP DELLA PROPRIA INTERFACCIA DI RETE WIFI e LASCIARE LA PORTA DEL SERVER (3001)  --> N.B.: L'INTERFACCIA DI RETE ETHERNET AVRà UN IP ADDRESS DIVERSO! (TIPICAMENTE QUELLO ETHERNET è IL 2O IP CHE CI VIENE DATO QUANDO SI RUNNA IL CLIENT DI UNA REACT APP, MENTRE QUELLO WIFI è IL 3O IP CHE CI VIENE DATO)
// base server url from which call the client API
const SERVER_URL = HTTP_AND_IP_ADDRESS_AND_PORT + '/api';

// image base path from which retrieve the images of dish from the server
const DISHES_PATH = HTTP_AND_IP_ADDRESS_AND_PORT + '/dishes/';

// image base path from which retrieve the images of dish from the server
const RESTAURANTS_PATH = HTTP_AND_IP_ADDRESS_AND_PORT + '/restaurants/';

// placeholder if no image is provided
const PLACEHOLDER2 = HTTP_AND_IP_ADDRESS_AND_PORT + '/placeholder.png';
const PLACEHOLDER = HTTP_AND_IP_ADDRESS_AND_PORT + '/placeholder2.png';

// API KEY for google maps address
const API_KEY = 'AIzaSyCvuhhqU5FKKc39jRLY1pviZAzcKeNLJdc';

// possible filters to apply/categories to enter when adding or editing a restaurant
const FILTERS = [];

// days of the week
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fry", "Sat", "Sun"];

// Allergens
const foodAllergens = ['Peanuts', 'Tree nuts', 'Lactose', 'Eggs', 'Soy', 'Gluten', 'Fish', 'Shellfish', 'Sesame seeds', 'Mustard', 'Celery', 'Sulphites', 'Lupin', 'Mollusks', 'Kiwi', 'Mango', 'Pineapple', 'Papaya', 'Avocado', 'Banana', 'Strawberry', 'Tomato', 'Bell peppers', 'Garlic', 'Onion', 'Carrot', 'Peach', 'Plum', 'Melons', 'Berries', 'Nickel']
  .map(item => ({ value: item, label: item }))
  .sort((a, b) => a.label.localeCompare(b.label));

function approssimaValoreAlRange(valore) {
    if (valore == 1 ) {
      return "1-10";
    } else if (valore == 2 ) {
      return "10-20";
    } else if (valore == 3 ) {
      return "20-30";
    } else if (valore == 4 ) {
      return "30-40";
    } else if (valore >4) {
      return "40+";
    }
  }

export{SERVER_URL,DISHES_PATH,RESTAURANTS_PATH,PLACEHOLDER,API_KEY,DAYS,foodAllergens,PLACEHOLDER2,approssimaValoreAlRange};