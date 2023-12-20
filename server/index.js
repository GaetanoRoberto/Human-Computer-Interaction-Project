'use strict';

/* COSTANTS */
const RESTAURANT_PATH = 'public/restaurants';
const DISH_PATH = 'public/dishes';
const INGREDIENT_PATH = 'public/ingredients';
const PLACEHOLDER = 'http://localhost:3001/placeholder.png';

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

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());

// static middleware to serve static contents through express 
app.use(express.static('./public'));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
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
  },async function verify(username, password, callback) {
  const user = await usersDao.getUser(username)
  if (!user)
    return callback(null, false, 'Incorrect username');

  return callback(null, {username: user.username, isRestaurateur:user.isRestaurateur}); // NOTE: user info in the session will be all the fields returned by usersDao.getUser
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
    const fileName = `image_${Date.now()}.png`;

    // Specify the path where you want to save the image
    // folder will be dishes or restaurants, depend on the case
    const filePath = `./${folder}/${fileName}`;

    // Write the image buffer to the file asynchronously
    await fs.writeFile(filePath,  Buffer.from(imageBuffer, 'base64'));

    const return_path = 'http://localhost:3001/' + filePath.split('./public/')[1];

    return { success: return_path };

  } catch (error) {
    throw { error: 'Internal Server Error' };
  }
}

function getServerPath(localhostPath, folder) {
  folder = folder.split('/')[0];
  return `./${folder}` + localhostPath.split('http://localhost:3001')[1];
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
    .catch(() => res.status(503).json({ error: 'Database Error' }));
});

// GET /api/restaurants
// This route is used to get all the restaurants (not complete info) for the home page
app.get('/api/restaurants', (req, res) => {
  restaurantsDao.getRestaurants()
    .then(restaurants => res.json(restaurants))
    .catch(() => res.status(503).json({ error: 'Database Error' }));
});

// GET /api/restaurants/:id
// This route is used to get the complete info of one restaurant (restaurant,dishes, ingredients (only name), reviews)
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    let return_struct = {};
    const restaurantId = req.params.id;
    // get restaurant
    const restaurant = await restaurantsDao.getRestaurant(restaurantId).catch(() => { throw { error: 'Database Error' } });
    return_struct = restaurant;
    // get dishes of a restaurant
    const dishes = await dishesDao.getDishes(restaurantId).catch(() => { throw { error: 'Database Error' } });
    // populate dishes_ingredients, create for each dish the dish + the array of ingredients 
    // struct to put together dish and ingredients => use Promise.all to wait for all asynchronous operations to complete
    const dishes_ingredients = await Promise.all(dishes.map(async (dish) => {
      const ingredients = await ingredientsDao.getIngredients(dish.id).catch(() => { throw { error: 'Database Error' } });
      dish.ingredients = ingredients;
      return dish;
    }));
    // get the reviews relatd to the restaurant
    const reviews = await reviewsDao.getReviews(req.params.id).catch(() => { throw { error: 'Database Error' } });
    // assign to the final struct the dishes and the reviews
    return_struct.dishes = dishes_ingredients;
    return_struct.reviews = reviews;
    // return it
    res.json(return_struct);
  } catch (error) {
    res.status(503).json({ error: 'Database Error' })
  }
});

// GET /api/ingredients/:id
// This route is used to get the complete infos of one ingredient (when opening the dedicated screen)
app.get('/api/ingredients/:id', (req, res) => {
  ingredientsDao.getIngredient(req.params.id)
    .then(ingredient => res.json(ingredient))
    .catch(() => res.status(503).json({ error: 'Database Error' }));
});

// GET /api/dishes/
// This route is used to get all the possible type of dishes, for filter in the home page.
app.get('/api/dishes/', (req, res) => {
  dishesDao.getFilters()
    .then(filters => res.json(filters))
    .catch(() => res.status(503).json({ error: 'Database Error' }));
});

// POST /api/restaurants
// This route is used to create a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
app.post('/api/restaurants',
  async (req, res) => {
    try {
      // take the information from the body and add the restaurant
      let restaurant_image_link = '';
      // since image can be null, if defined save it, otherwise return placeholder image to visualize
      if (req.body.image) {
        restaurant_image_link = await saveImageToServer(req.body.image,RESTAURANT_PATH).catch(() => { throw { error: 'Database Error' } });
        restaurant_image_link = restaurant_image_link.success;
      } else {
        restaurant_image_link = PLACEHOLDER;
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
        hours: req.body.hours,
        description: req.body.description
      };
      // insert restaurant into the db
      const new_restaurant = await restaurantsDao.insertRestaurant(restaurant).catch(() => { throw { error: 'Database Error' } });
      // take the information from the body and add all the dishes related to the restaurant
      const dishes = [];
      for (const dish of req.body.dishes) {
          let dish_image_link = '';
          
          // since image can be null, if defined save it, otherwise return placeholder image to visualize
          if (dish.image) {
            dish_image_link = await saveImageToServer(dish.image, DISH_PATH).catch(() => {
              throw { error: 'Database Error' };
            });
            dish_image_link = dish_image_link.success;
          } else {
            dish_image_link = PLACEHOLDER;
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
        const new_dish = await dishesDao.insertDish(dish).catch(() => { throw { error: 'Database Error' } });
        new_dish.ingredients = ingredients;
        return new_dish;
      }));
      
      // take the information from the body and add all the ingredients related to the dishes
      const ingredients = [];
      for (const dish of new_dishes) {
        for (const ingredient of dish.ingredients) {
          let ingredient_image_link = '';
          
          // since image can be null, if defined save it, otherwise return placeholder image to visualize
          if (ingredient.image) {
            ingredient_image_link = await saveImageToServer(ingredient.image,INGREDIENT_PATH).catch(() => { throw { error: 'Database Error' } });
            ingredient_image_link = ingredient_image_link.success;
          } else {
            ingredient_image_link = PLACEHOLDER;
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
        return await ingredientsDao.insertIngredient(ingredient).catch(() => { throw { error: 'Database Error' } });
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
      res.status(503).json({ error: 'Database Error' })
    }
  }
);

// POST /api/restaurants/:id
// This route is used to edit a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
app.post('/api/restaurants/:id',
  async (req, res) => {
    try {
      let restaurant_image_link;
      // check if there is a new image
      if (req.body.image) {
        // check if image is not changed, otherwise useless to re-save it
        const restaurant_path = await restaurantsDao.getRestaurantImage(req.params.id).catch(() => { throw { error: 'Database Error' } });
        const restaurant_image_path = getServerPath(restaurant_path.image,RESTAURANT_PATH);
        let old_image = await fs.readFile(restaurant_image_path);
        old_image = 'data:image/png;base64,' + old_image.toString('base64');
        if (old_image === req.body.image) {
          // image not changed
          restaurant_image_link = restaurant_path.image;
        } else {
          //image changed
          restaurant_image_link = await saveImageToServer(req.body.image,RESTAURANT_PATH).catch(() => { throw { error: 'Database Error' } });
          restaurant_image_link = restaurant_image_link.success;
        }
      } else {
        // no new image to update, return the old image if there is one or the placeholder if not
        const restaurant_path = await restaurantsDao.getRestaurantImage(req.params.id).catch(() => { throw { error: 'Database Error' } });
        if (restaurant_path.image) {
          // image is present, use it
          restaurant_image_link = restaurant_path.image;
        } else {
          // no image previously, use the placeholder
          restaurant_image_link = PLACEHOLDER;
        }
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
        hours: req.body.hours,
        description: req.body.description
      };
      // insert restaurant into the db
      const new_restaurant = await restaurantsDao.updateRestaurant(restaurant).catch(() => { throw { error: 'Database Error' } });
      // take the information from the body and add all the dishes related to the restaurant
      const dishes = [];
      for (const dish of req.body.dishes) {
          let dish_image_link;
          // check if there is a new image
          if (dish.image) {
            // check if image is not changed, otherwise useless to re-save it
            const dish_path = await dishesDao.getDishImage(dish.id).catch(() => { throw { error: 'Database Error' } });
            const dish_image_path = getServerPath(dish_path.image,DISH_PATH);
            let old_image = await fs.readFile(dish_image_path);       
            old_image = 'data:image/png;base64,' + old_image.toString('base64');
            if (old_image === dish.image) {
              // image not changed
              dish_image_link = dish_path.image;
            } else {
              //image changed
              dish_image_link = await saveImageToServer(dish.image,DISH_PATH).catch(() => { throw { error: 'Database Error' } });
              dish_image_link = dish_image_link.success;
            }
          } else {
            // no new image to update, return the old image if there is one or the placeholder if not
            const dish_path = await dishesDao.getDishImage(dish.id).catch(() => { throw { error: 'Database Error' } });
            if (dish_path.image) {
              // image is present, use it
              dish_image_link = dish_path.image;
            } else {
              // no image previously, use the placeholder
              dish_image_link = PLACEHOLDER;
            }
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

      // insert dishes into the db
      const new_dishes = await Promise.all(dishes.map(async (dish) => {
        const ingredients = dish.ingredients;
        delete dish.ingredients;
        const new_dish = await dishesDao.updateDish(dish).catch(() => { throw { error: 'Database Error' } });
        new_dish.ingredients = ingredients;
        return new_dish;
      }));

      // take the information from the body and add all the ingredients related to the dishes
      const ingredients = [];
      for (const dish of new_dishes) {
        for (const ingredient of dish.ingredients) {
          let ingredient_image_link;
          // check if there is a new image
          if (ingredient.image) {
            // check if image is not changed, otherwise useless to re-save it
            const ingredient_path = await ingredientsDao.getIngredientImage(ingredient.id).catch(() => { throw { error: 'Database Error' } });
            const ingredient_image_path = getServerPath(ingredient_path.image,INGREDIENT_PATH);
            let old_image = await fs.readFile(ingredient_image_path);
            old_image = 'data:image/png;base64,' + old_image.toString('base64');
            if (old_image === ingredient.image) {
              // image not changed
              ingredient_image_link = ingredient_path.image;
            } else {
              //image changed
              ingredient_image_link = await saveImageToServer(ingredient.image,INGREDIENT_PATH).catch(() => { throw { error: 'Database Error' } });
              ingredient_image_link = ingredient_image_link.success;
            }
          } else {
            // no new image to update, return the old image if there is one or the placeholder if not
            const ingredient_path = await ingredientsDao.getIngredientImage(ingredient.id).catch(() => { throw { error: 'Database Error' } });
            if (ingredient_path.image) {
              // image is present, use it
              ingredient_image_link = ingredient_path.image;
            } else {
              // no image previously, use the placeholder
              ingredient_image_link = PLACEHOLDER;
            }
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
      // insert ingredients into the db
      const new_ingredients = await Promise.all(ingredients.map(async (ingredient) => {
        return await ingredientsDao.updateIngredient(ingredient).catch(() => { throw { error: 'Database Error' } });
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
      res.status(503).json({ error: 'Database Error' })
    }
  }
);

// DELETE /api/restaurants/:id
// This route is used to delete a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
app.delete('/api/restaurants/:id', (req, res) => {
  restaurantsDao.deleteRestaurant(req.params.id)
    .then(msg => res.json(msg))
    .catch(() => res.status(503).json({ error: 'Database Error' }));
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
      const review_present = await reviewsDao.checkReview(review.username,review.restaurantId).catch(() => { throw { error: 'Database Error' } });
      if (review_present.error) {
          throw { error: review_present.error }
      }
      // if not insert the review
      const new_review = await reviewsDao.insertReview(review).catch(() => { throw { error: 'Database Error' } });
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
      const review_present = await reviewsDao.getReview(review.id).catch(() => { throw { error: 'Database Error' } });
      if (review_present.error) {
          throw { error: review_present.error }
      }
      // if not update the review
      const new_review = await reviewsDao.updateReview(review).catch(() => { throw { error: 'Database Error' } });
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
    .catch(() => res.status(503).json({ error: 'Database Error' }));
});

// GET /api/reviews/:username
// This route is used to get the reviews done by the user
app.get('/api/reviews/:username', (req, res) => {
  reviewsDao.getReviewsByUsername(req.params.username)
    .then(ingredient => res.json(ingredient))
    .catch(() => res.status(503).json({ error: 'Database Error' }));
});

// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));