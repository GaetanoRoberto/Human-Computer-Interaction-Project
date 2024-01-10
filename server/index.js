'use strict';

/* COSTANTS */
const RESTAURANT_PATH = 'public/restaurants';
const DISH_PATH = 'public/dishes';
const INGREDIENT_PATH = 'public/ingredients';

/*** Importing modules ***/
const fs = require('fs').promises;
const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const cors = require('cors');
//const dayjs = require('dayjs');
//const { param, check, validationResult } = require('express-validator'); // validation middleware

const restaurantsDao = require('./dao-restaurants'); // module for accessing the restaurants table in the DB
const dishesDao = require('./dao-dishes'); // module for accessing the dishes table in the DB
const ingredientsDao = require('./dao-ingredients'); // module for accessing the ingredients table in the DB
const reviewsDao = require('./dao-reviews'); // module for accessing the reviews table in the DB
const usersDao = require('./dao-users'); // module for accessing the users table in the DB
const retrieveIp = require('./retrieve-ip');
const IP_ADDRESS_AND_PORT = retrieveIp.getLocalWirelessIP();
const PLACEHOLDER = IP_ADDRESS_AND_PORT + '/placeholder.png';

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());

// static middleware to serve static contents through express 
app.use(express.static('./public'));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', IP_ADDRESS_AND_PORT.split(":3001")[0] +':5173', IP_ADDRESS_AND_PORT.split(":3001")[0] +':5174'],
  credentials: true,
};
app.use(cors(corsOptions));

/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method usersDao.getUser
 **/
passport.use(new LocalStrategy({
  usernameField: 'username',    // define the parameter in req.body that passport can use as username and password
  passwordField: 'isRestaurateur'
}, async function verify(username, password, callback) {
  const user = await usersDao.getUser(username)
  if (!user)
    return callback(null, false, 'Incorrect username');

  return callback(null, { username: user.username, isRestaurateur: user.isRestaurateur }); // NOTE: user info in the session will be all the fields returned by usersDao.getUser
}));

// Serializing in the session the user object given from the above LocalStrategy
passport.serializeUser(function (user, callback) { // this user is:  username + isRestaurateur 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is:  username + isRestaurateur 
  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

// set up the secret used to sign the session cookie
app.use(session({
  secret: "ckmdnvvnkecwmoefmw",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/*** Utility Functions ***/

async function saveImageToServer(imageBuffer, folder) {
  try {
    if (!imageBuffer) {
      throw new Error('Image buffer is required.');
    }

    imageBuffer = imageBuffer.replace(/^data:image\/\w+;base64,/, '');

    // Generate a unique filename for the image (you can use a library like uuid)
    const fileName = `image_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.png`;

    // Specify the path where you want to save the image
    // folder will be dishes or restaurants, depend on the case
    const filePath = `./${folder}/${fileName}`;

    // Write the image buffer to the file asynchronously
    await fs.writeFile(filePath, Buffer.from(imageBuffer, 'base64'));

    const return_path = IP_ADDRESS_AND_PORT + '/' + filePath.split('./public/')[1];

    return { success: return_path };

  } catch (error) {
    throw { error: 'Internal Server Error' };
  }
}

function getServerPath(localhostPath, folder) {
  folder = folder.split('/')[0];
  return `./${folder}` + localhostPath.split(IP_ADDRESS_AND_PORT)[1];
}

/*** Session API ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user informations (username + isRestaurateur), we send all the user info back
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
// possible to call only if the user is loggedIn, otherwise logout makes no sense.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json(null);
  });
});

/*** APIs ***/

// GET /api/users/:username
// This route is used to get the info of an user with that username
app.get('/api/users/:username', (req, res) => {
  usersDao.getUser(req.params.username)
    .then(user => res.json(user))
    .catch(() => res.status(503).json({ error: 'Database Error in Getting the User' }));
});

// POST /api/users/:username
// This route is used to update the info of an user with that username
app.post('/api/users/:username',
  async (req, res) => {
    try {
      const user = {
        username: req.params.username,
        position: req.body.position,
        isRestaurateur: req.body.isRestaurateur
      };

      const updated_user = await usersDao.updateUser(user).catch(() => { throw { error: 'Database Error in Updating The User' } });
      res.json(updated_user);
    } catch (error) {
      res.status(503).json({ error: error.error })
    }

  }
);

// GET /api/restaurants
// This route is used to get all the restaurants (not complete info), along with their type of dishes (to filter) for the home page
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await restaurantsDao.getRestaurants().catch(() => { throw { error: 'Database Error in Getting the Restaurants' } });
    const return_struct = restaurants;
    for (const restaurant of return_struct) {
      const types = await dishesDao.getRestaurantFilters(restaurant.id).catch(() => { throw { error: 'Database Error in Getting the type of dishes of the Restaurants' } });
      restaurant.dish_types = types;
      const dishes_avg_price = await dishesDao.getDishesAvgPrice(restaurant.id).catch(() => { throw { error: 'Database Error in Getting the Average Price of the Dishes linked to the Restaurant' }});
      restaurant.dishes_avg_price = dishes_avg_price;
    }
    // return all the restaurant along with their dishes
    res.json(return_struct);
  } catch (error) {
    console.log(error);
    res.status(503).json({ error: error.error })
  }
});

// GET /api/restaurants/:id
// This route is used to get the complete info of one restaurant (restaurant,dishes, ingredients (only name), reviews)
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    let return_struct = {};
    const restaurantId = req.params.id;
    // get restaurant
    const restaurant = await restaurantsDao.getRestaurant(restaurantId).catch(() => { throw { error: 'Database Error in Getting the Restaurant' } });
    return_struct = restaurant;
    // get dishes of a restaurant
    const dishes = await dishesDao.getDishes(restaurantId).catch(() => { throw { error: 'Database Error in Getting the Dishes' } });
    // populate dishes_ingredients, create for each dish the dish + the array of ingredients 
    // struct to put together dish and ingredients => use Promise.all to wait for all asynchronous operations to complete
    const dishes_ingredients = await Promise.all(dishes.map(async (dish) => {
      const ingredients = await ingredientsDao.getIngredients(dish.id).catch(() => { throw { error: 'Database Error in Getting the Ingredients' } });
      dish.ingredients = ingredients;
      return dish;
    }));
    // get the reviews relatd to the restaurant
    const reviews = await reviewsDao.getReviews(req.params.id).catch(() => { throw { error: 'Database Error in Getting the Reviews' } });
    // assign to the final struct the dishes and the reviews
    return_struct.dishes = dishes_ingredients;
    return_struct.reviews = reviews;
    // return it
    res.json(return_struct);
  } catch (error) {
    res.status(503).json({ error: error.error })
  }
});

// GET /api/restaurants/inserted
// This route is used to get the only inserted restaurant
app.get('/api/insertedrestaurants/', async (req, res) => {
  try {
    let return_struct = {};
    // get restaurant
    const restaurant = await restaurantsDao.getRestaurantInserted().catch(() => { throw { error: 'Database Error in Getting the Inserted Restaurant' } });
    return_struct = restaurant;
    // get dishes of a restaurant
    const dishes = await dishesDao.getDishes(restaurant.id).catch(() => { throw { error: 'Database Error in Getting the Dishes' } });
    // populate dishes_ingredients, create for each dish the dish + the array of ingredients 
    // struct to put together dish and ingredients => use Promise.all to wait for all asynchronous operations to complete
    const dishes_ingredients = await Promise.all(dishes.map(async (dish) => {
      const ingredients = await ingredientsDao.getIngredients(dish.id).catch(() => { throw { error: 'Database Error in Getting the Ingredients' } });
      dish.ingredients = ingredients;
      return dish;
    }));
    // get the reviews relatd to the restaurant
    const reviews = await reviewsDao.getReviews(restaurant.id).catch(() => { throw { error: 'Database Error in Getting the Reviews' } });
    // assign to the final struct the dishes and the reviews
    return_struct.dishes = dishes_ingredients;
    return_struct.reviews = reviews;
    // return it
    res.json(return_struct);
  } catch (error) {
    res.status(503).json({ error: error.error })
  }
});

// GET /api/ingredients/:id
// This route is used to get the complete infos of one ingredient (when opening the dedicated screen)
app.get('/api/ingredients/:id', (req, res) => {
  ingredientsDao.getIngredient(req.params.id)
    .then(ingredient => res.json(ingredient))
    .catch(() => res.status(503).json({ error: 'Database Error in Getting the Ingredient' }));
});

// GET /api/dishes/
// This route is used to get all the possible type of dishes, for filter in the home page.
app.get('/api/dishes/', (req, res) => {
  dishesDao.getFilters()
    .then(filters => res.json(filters))
    .catch(() => res.status(503).json({ error: 'Database Error in Getting all Possible type of dishes' }));
});

// GET /api/dishes/:id
// This route is used to get all the ingredients for a given dish
app.get('/api/dishes/:id', async (req, res) => {
  ingredientsDao.getIngredients(req.params.id)
    .then(ingredients => res.json(ingredients))
    .catch(() => res.status(503).json({ error: 'Database Error in Getting all the Ingredients for the Given Dish' }));
});

// POST /api/restaurants
// This route is used to create a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
app.post('/api/restaurants',
  async (req, res) => {
    try {
      // take the information from the body and add the restaurant
      let restaurant_image_link = '';
      // if it's not an URL (expect base64 data) save it, otherwise return image URL provided to visualize
      if (req.body.image && !req.body.image.startsWith(IP_ADDRESS_AND_PORT)) {
        restaurant_image_link = await saveImageToServer(req.body.image, RESTAURANT_PATH).catch(() => { throw { error: 'Error in Saving the Restaurant Image to the Server' } });
        restaurant_image_link = restaurant_image_link.success;
      } else {
        restaurant_image_link = req.body.image;
      }

      const restaurant = {
        isNewInserted: req.body.isNewInserted,
        image: restaurant_image_link,
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        website: req.body.website,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        twitter: req.body.twitter,
        hours: req.body.hours,
        description: req.body.description
      };
      // insert restaurant into the db
      const new_restaurant = await restaurantsDao.insertRestaurant(restaurant).catch(() => { throw { error: 'Database Error in Inserting the Restaurant' } });
      // take the information from the body and add all the dishes related to the restaurant
      const dishes = [];
      for (const dish of req.body.dishes) {
        let dish_image_link = '';

        // if it's not an URL (expect base64 data) save it, otherwise return image URL provided to visualize
        if (dish.image && !dish.image.startsWith(IP_ADDRESS_AND_PORT)) {
          dish_image_link = await saveImageToServer(dish.image, DISH_PATH).catch(() => {
            throw { error: 'Error in Saving the Dish Image to the Server' };
          });
          dish_image_link = dish_image_link.success;
        } else {
          dish_image_link = dish.image;
        }

        dishes.push({
          restaurantId: new_restaurant.id,
          name: dish.name,
          price: dish.price,
          type: dish.type,
          image: dish_image_link,
          ingredients: dish.ingredients
        })
      }

      // insert dishes into the db
      const new_dishes = await Promise.all(dishes.map(async (dish) => {
        const ingredients = dish.ingredients;
        delete dish.ingredients;
        const new_dish = await dishesDao.insertDish(dish).catch(() => { throw { error: 'Database Error in Inserting the Dish' } });
        new_dish.ingredients = ingredients;
        return new_dish;
      }));

      // take the information from the body and add all the ingredients related to the dishes
      const ingredients = [];
      for (const dish of new_dishes) {
        for (const ingredient of dish.ingredients) {
          let ingredient_image_link = '';

          // if it's not an URL (expect base64 data) save it, otherwise return image URL provided to visualize
          if (ingredient.image && !ingredient.image.startsWith(IP_ADDRESS_AND_PORT)) {
            ingredient_image_link = await saveImageToServer(ingredient.image, INGREDIENT_PATH).catch(() => { throw { error: 'Error in Saving the Ingredient Image to the Server' } });
            ingredient_image_link = ingredient_image_link.success;
          } else {
            ingredient_image_link = ingredient.image;
          }

          ingredients.push({
            dishId: dish.id,
            image: ingredient_image_link,
            name: ingredient.name,
            allergens: ingredient.allergens,
            brandName: ingredient.brandName,
            brandLink: ingredient.brandLink
          });
        }
      }
      // insert ingredients into the db
      const new_ingredients = await Promise.all(ingredients.map(async (ingredient) => {
        return await ingredientsDao.insertIngredient(ingredient).catch(() => { throw { error: 'Database Error in Inserting the Ingredient' } });
      }));
      // construct the object to return
      let return_struct = {};
      return_struct = new_restaurant;
      const dishes_ingredients = [];
      for (const new_dish of new_dishes) {
        const temp_dish = new_dish;
        temp_dish.ingredients = [];
        for (const new_ingredient of new_ingredients) {
          if (temp_dish.id === new_ingredient.dishId) {
            temp_dish.ingredients.push(new_ingredient);
          }
        }
        dishes_ingredients.push(temp_dish);
      }
      // assign to the final struct the dishes
      return_struct.dishes = dishes_ingredients;
      // return it
      res.json(return_struct);
    } catch (error) {
      res.status(503).json({ error: error.error })
    }
  }
);

// POST /api/restaurants/:id
// This route is used to edit a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
app.post('/api/restaurants/:id',
  async (req, res) => {
    try {
      let restaurant_image_link;
      // check if there is a new image (so base64 data not an URL)
      if (req.body.image && !req.body.image.startsWith(IP_ADDRESS_AND_PORT)) {
        // check if image is not changed, otherwise useless to re-save it
        const restaurant_path = await restaurantsDao.getRestaurantImage(req.params.id).catch(() => { throw { error: 'Error in Getting the Restaurant image from The Server' } });
        const restaurant_image_path = getServerPath(restaurant_path.image, RESTAURANT_PATH);
        let old_image = await fs.readFile(restaurant_image_path);
        old_image = 'data:image/png;base64,' + old_image.toString('base64');
        if (old_image === req.body.image) {
          // image not changed
          restaurant_image_link = restaurant_path.image;
        } else {
          //image changed, delete the old save the new
          // delete only if not placeholder
          if (restaurant_path.image !== PLACEHOLDER) {
            await fs.unlink(restaurant_image_path).catch(() => { throw { error: 'Error in deleting the Restaurant Image from the Server' } });
          }
          restaurant_image_link = await saveImageToServer(req.body.image, RESTAURANT_PATH).catch(() => { throw { error: 'Error in Saving the Restaurant Image to The Server' } });
          restaurant_image_link = restaurant_image_link.success;
        }
      } else {
        // no new image to save, return the provided URL
        restaurant_image_link = req.body.image;
      }

      // take the information from the body and add the restaurant
      const restaurant = {
        id: req.params.id,
        isNewInserted: req.body.isNewInserted,
        image: restaurant_image_link,
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        website: req.body.website,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        twitter: req.body.twitter,
        hours: req.body.hours,
        description: req.body.description
      };
      // insert restaurant into the db
      const new_restaurant = await restaurantsDao.updateRestaurant(restaurant).catch(() => { throw { error: 'Database Error in Updating the Restaurant' } });

      // getting the dishes and ingredient images currently stored in the server (URL in the db) of the restaurant to edit
      const dishes_images = await dishesDao.getAllDishesImages(new_restaurant.id).catch(() => { throw { error: 'Database Error in Getting all The Dishes Images' } });
      const ingredients_images = [];
      await Promise.all(dishes_images.map(async (dish) => {
        const vett = await ingredientsDao.getAllIngredientsImages(dish.id).catch(() => { throw { error: 'Database Error in Getting all The Ingredients Images' } });
        ingredients_images.push(...vett);
      }));
      // getting the dishes and ingredients images received from the http post
      const body_dishes_images = req.body.dishes.map((dish) => dish.image);
      const body_ingredients_images = req.body.dishes.map((dish) => dish.ingredients.map((ingredient) => ingredient.image)).flat();
      
      // iterate through the server images of dishes
      await Promise.all(dishes_images.map(async (dish) => {
        // if is not present in the body arrays and not placeholder delete it, otherwise it's still needed
        if (!body_dishes_images.includes(dish.image) && dish.image !== PLACEHOLDER) {
          const image_to_delete = getServerPath(dish.image, DISH_PATH);
          await fs.unlink(image_to_delete).catch(() => { throw { error: 'Error in deleting the Dish Image from the Server' } });
        }
      }));
      
      // iterate through the server images of ingredients
      await Promise.all(ingredients_images.map(async (ingredient_image) => {
        // if is not present in the body arrays and not placeholder delete it, otherwise it's still needed
        if (!body_ingredients_images.includes(ingredient_image) && ingredient_image !== PLACEHOLDER) {
          const image_to_delete = getServerPath(ingredient_image, INGREDIENT_PATH);
          await fs.unlink(image_to_delete).catch(() => { throw { error: 'Error in deleting the Ingredient Image from the Server' } });
        }
      }));
      
      // delete all dishes of the restaurant and their ingredients from the db (for ingredients ON DELETE CASCADE)
      await dishesDao.deleteAllRestaurantDishes(new_restaurant.id).catch(() => { throw { error: 'Database Error in Deleting all the Dishes of the Restaurant' } });

      // take the information from the body and add all the dishes related to the restaurant
      const dishes = [];
      for (const dish of req.body.dishes) {
        let dish_image_link = '';

        // if it's not an URL (expect base64 data) save it, otherwise return image URL provided to visualize
        if (dish.image && !dish.image.startsWith(IP_ADDRESS_AND_PORT)) {
          dish_image_link = await saveImageToServer(dish.image, DISH_PATH).catch(() => {
            throw { error: 'Error in Saving the Dish Image to the Server' };
          });
          dish_image_link = dish_image_link.success;
        } else {
          dish_image_link = dish.image;
        }

        dishes.push({
          id: dish.id,
          restaurantId: new_restaurant.id,
          name: dish.name,
          price: dish.price,
          type: dish.type,
          image: dish_image_link,
          ingredients: dish.ingredients
        })
      }

      // insert the dishes from scratch
      const new_dishes = await Promise.all(dishes.map(async (dish) => {
        const ingredients = dish.ingredients;
        delete dish.ingredients;
        const new_dish = await dishesDao.insertDish(dish).catch(() => { throw { error: 'Database Error in Inserting the Dish' } });
        new_dish.ingredients = ingredients;
        return new_dish;
      }));

      // take the information from the body and add all the ingredients related to the dishes
      const ingredients = [];
      for (const dish of new_dishes) {
        for (const ingredient of dish.ingredients) {
          let ingredient_image_link = '';

          // if it's not an URL (expect base64 data) save it, otherwise return image URL provided to visualize
          if (ingredient.image && !ingredient.image.startsWith(IP_ADDRESS_AND_PORT)) {
            ingredient_image_link = await saveImageToServer(ingredient.image, INGREDIENT_PATH).catch(() => { throw { error: 'Error in Saving the Ingredient Image to the Server' } });
            ingredient_image_link = ingredient_image_link.success;
          } else {
            ingredient_image_link = ingredient.image;
          }

          ingredients.push({
            id: ingredient.id,
            dishId: dish.id,
            image: ingredient_image_link,
            name: ingredient.name,
            allergens: ingredient.allergens,
            brandName: ingredient.brandName,
            brandLink: ingredient.brandLink
          });
        }
      }

      // insert the ingredients from scratch
      const new_ingredients = await Promise.all(ingredients.map(async (ingredient) => {
        return await ingredientsDao.insertIngredient(ingredient).catch(() => { throw { error: 'Database Error in Inserting the Ingredient' } });
      }));

      // construct the object to return
      let return_struct = {};
      return_struct = new_restaurant;
      const dishes_ingredients = [];
      for (const new_dish of new_dishes) {
        const temp_dish = new_dish;
        temp_dish.ingredients = [];
        for (const new_ingredient of new_ingredients) {
          if (temp_dish.id === new_ingredient.dishId) {
            temp_dish.ingredients.push(new_ingredient);
          }
        }
        dishes_ingredients.push(temp_dish);
      }
      // assign to the final struct the dishes
      return_struct.dishes = dishes_ingredients;
      // return it
      res.json(return_struct);
    } catch (error) {
      res.status(503).json({ error: error })
    }
  }
);

// DELETE /api/restaurants/:id
// This route is used to delete a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
app.delete('/api/restaurants/:id', (req, res) => {
  restaurantsDao.deleteRestaurant(req.params.id)
    .then(msg => res.json(msg))
    .catch(() => res.status(503).json({ error: 'Database Error in Deleting the Restaurant' }));
});

// GET /api/reviews/:username
// This route is used to get the reviews done by the user
app.get('/api/reviews/users/:username', async (req, res) => {
  try {
    const reviews = await reviewsDao.getReviewsByUsername(req.params.username).catch(() => res.status(503).json(() => { throw { error: 'Database Error in Getting all the Reviews Done by an User' } })); 
    for (const review of reviews) {
      const restaurant = await restaurantsDao.getRestaurant(review.restaurantId).catch(() => res.status(503).json(() => { throw { error: 'Database Error in Getting the Restaurant related to the Review' } }));
      review.restaurant_name = restaurant.name;
    }
    res.json(reviews);
  } catch (error) {
    res.status(503).json({ error: error.error })
  }
});

// GET /api/reviews/:id
// This route is used to get the review with that id
app.get('/api/reviews/:id', (req, res) => {
  reviewsDao.getReview(req.params.id)
    .then(review => res.json(review))
    .catch(() => res.status(503).json({ error: 'Database Error in Getting the Review' }));
});

// POST /api/reviews/
// This route is used to insert a review
app.post('/api/reviews/',
  async (req, res) => {
    try {
      const review = {
        username: req.body.username,
        restaurantId: req.body.restaurantId,
        date: req.body.date,
        title: req.body.title,
        description: req.body.description,
        quality: req.body.quality,
        safety: req.body.safety,
        price: req.body.price
      };

      // if review already exist, trigger an error
      const review_present = await reviewsDao.checkReview(review.username, review.restaurantId).catch(() => { throw { error: 'Database Error in Checking the Review' } });
      if (review_present.error) {
        throw { error: review_present.error }
      }
      // if not insert the review
      const new_review = await reviewsDao.insertReview(review).catch(() => { throw { error: 'Database Error in Inserting the Review' } });
      res.json(new_review);
    } catch (error) {
      res.status(503).json({ error: error.error })
    }

  }
);

// POST /api/reviews/:id
// This route is used to update a review
app.post('/api/reviews/:id',
  async (req, res) => {
    try {
      const review = {
        id: req.params.id,
        username: req.body.username,
        restaurantId: req.body.restaurantId,
        date: req.body.date,
        title: req.body.title,
        description: req.body.description,
        quality: req.body.quality,
        safety: req.body.safety,
        price: req.body.price
      };

      // if review not exist, trigger an error
      const review_present = await reviewsDao.getReview(review.id).catch(() => { throw { error: 'Database Error in Getting the Review' } });
      if (review_present.error) {
        throw { error: review_present.error }
      }
      // if not update the review
      const new_review = await reviewsDao.updateReview(review).catch(() => { throw { error: 'Database Error in Updating the Review' } });
      res.json(new_review);
    } catch (error) {
      res.status(503).json({ error: error.error })
    }

  }
);

// DELETE /api/reviews/:id
// This route is used to delete a review
app.delete('/api/reviews/:id', (req, res) => {
  reviewsDao.deleteReview(req.params.id)
    .then(msg => res.json(msg))
    .catch(() => res.status(503).json({ error: 'Database Error in Deleting the Review' }));
});

// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on ${IP_ADDRESS_AND_PORT}/`));
