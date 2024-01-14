import dayjs from "dayjs";
import { SERVER_URL } from "./components/Costants";

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
async function logIn(credentials) {
    const response = await fetch(SERVER_URL + '/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify(credentials),
    }).catch(() => {throw {error: "Connection Error"}});
    if (response.ok) {
      // 200 status code, parse and return the object
      const user = await response.json();
      return ({
        username: user.username,
        isRestaurateur: user.isRestaurateur
      });
    } else {
      // json object provided by the server with the error
      const error = await response.json();
      throw error;
    }
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
async function getUserInfo() {
    const response = await fetch(SERVER_URL + '/sessions/current', {
      // this parameter specifies that authentication cookie must be forwared
      credentials: 'include'
    }).catch(() => {throw {error: "Connection Error"}});
    if (response.ok) {
      // 200 status code, parse and return the object
      const user = await response.json();
      return ({
        username: user.username,
        isRestaurateur: user.isRestaurateur
      });
    } else {
      // json object provided by the server with the error
      const error = await response.json();
      throw error;
    }
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
async function logOut() {
    const response = await fetch(SERVER_URL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
    }).catch(() => {throw {error: "Connection Error"}});
    if (response.ok) {
      // 200 status code, parse and return the object
      const emptyUser = await response.json();
      return emptyUser;
    } else {
      // json object provided by the server with the error
      const error = await response.json();
      throw error;
    }
};

/**
 * This function is used to get the info of an user with that username
 * It returns a JSON object
 */
async function getUser(username) {
  const response = await fetch(SERVER_URL + `/users/${username}`).catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const users = await response.json();
    return users;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to update a user
 * It returns a JSON object
 */
async function updateUser(user) {
  const response = await fetch(SERVER_URL + `/users/${user.username}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(Object.assign({}, user)),
  }).catch(() => { throw { error: "Connection Error" } });
  if (response.ok) {
    // 200 status code, parse and return the object
    const response_user = await response.json();
    return response_user;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
}

/**
 * This function is used to get all the restaurants (not complete info) for the home page
 * It returns a JSON object
 */
async function getRestaurants() {
  const response = await fetch(SERVER_URL + '/restaurants').catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const restaurants = await response.json();
    return restaurants;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to get the complete info of one restaurant (restaurant,dishes, ingredients (only name), reviews)
 * It returns a JSON object
 */
async function getRestaurant(restaurantId) {
  const response = await fetch(SERVER_URL + `/restaurants/${restaurantId}`).catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const restaurant = await response.json();
    return restaurant;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to get the complete info of one restaurant (restaurant,dishes, ingredients (only name), reviews)
 * It returns a JSON object
 */
async function getInsertedRestaurant() {
  const response = await fetch(SERVER_URL + '/insertedrestaurants').catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const restaurant = await response.json();
    return restaurant;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to get all the available categories and allergens for allow the user to filter for them in the filters route
 * It returns a JSON object
 */
async function getFilteringInfos() {
  const response = await fetch(SERVER_URL + '/filterinfos').catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const filterinfos = await response.json();
    return filterinfos;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to get the complete infos of one ingredient (when opening the dedicated screen)
 * It returns a JSON object
 */
async function getIngredient(ingredientId) {
  const response = await fetch(SERVER_URL + `/ingredients/${ingredientId}`).catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const ingredient = await response.json();
    return ingredient;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to get all the possible type of dishes, for filter in the home page.
 * It returns a JSON object
 */
async function getFilters() {
  const response = await fetch(SERVER_URL + '/dishes/').catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const filters = await response.json();
    return filters;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to get all to get a given dish
 * It returns a JSON object
 */
async function getDish(id) {
  const response = await fetch(SERVER_URL + `/dishes/${id}`).catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const ingredients = await response.json();
    return ingredients;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to create a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
 * It returns a JSON object
 */
async function createRestaurant(restaurant) {
  const response = await fetch(SERVER_URL + '/restaurants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(Object.assign({}, restaurant)),
  }).catch(() => { throw { error: "Connection Error" } });
  if (response.ok) {
    // 200 status code, parse and return the object
    const response_restaurant = await response.json();
    return response_restaurant;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
}

/**
 * This function is used to edit a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
 * It returns a JSON object
 */
async function editRestaurant(restaurant) {
  const response = await fetch(SERVER_URL + `/restaurants/${restaurant.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(Object.assign({}, restaurant)),
  }).catch(() => { throw { error: "Connection Error" } });
  if (response.ok) {
    // 200 status code, parse and return the object
    const response_restaurant = await response.json();
    return response_restaurant;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
}

/**
 * This function is used to delete a restaurant with all the infos (restaurant,dishes,ingredients) as atomic operation
 * It returns a JSON object
 */
async function deleteRestaurant(restaurantId) {
  const response = await fetch(SERVER_URL + `/restaurants/${restaurantId}`, {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  }).catch(() => { throw { error: "Connection Error" } });
  if (response.ok) {
    // 200 status code, parse and return the object
    const emptyRestaurant = await response.json();
    return emptyRestaurant;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
}

/**
 * This function is used to get the info of an user with that username
 * It returns a JSON object
 */
async function getReview(review_id) {
  const response = await fetch(SERVER_URL + `/reviews/${review_id}`).catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const review = await response.json();
    return review;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

/**
 * This function is used to insert a review
 * It returns a JSON object
 */
async function createReview(review) {
  const response = await fetch(SERVER_URL + '/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(Object.assign({}, review)),
  }).catch(() => { throw { error: "Connection Error" } });
  if (response.ok) {
    // 200 status code, parse and return the object
    const response_review = await response.json();
    return response_review;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
}

/**
 * This function is used to update a review
 * It returns a JSON object
 */
async function updateReview(review) {
  const response = await fetch(SERVER_URL + `/reviews/${review.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(Object.assign({}, review)),
  }).catch(() => { throw { error: "Connection Error" } });
  if (response.ok) {
    // 200 status code, parse and return the object
    const response_review = await response.json();
    return response_review;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
}

/**
 * This function is used to delete a review
 * It returns a JSON object
 */
async function deleteReview(reviewId) {
  const response = await fetch(SERVER_URL + `/reviews/${reviewId}`, {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  }).catch(() => { throw { error: "Connection Error" } });
  if (response.ok) {
    // 200 status code, parse and return the object
    const review = await response.json();
    return review;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
}

/**
 * This function is used to get the reviews done by the user
 * It returns a JSON object
 */
async function getReviewsByUser(username) {
  const response = await fetch(SERVER_URL + `/reviews/users/${username}`).catch(() => {throw {error: "Connection Error"}});
  if (response.ok) {
    // 200 status code, return the object
    const reviews = await response.json();
    return reviews;
  } else {
    // json object provided by the server with the error
    const error = await response.json();
    throw error;
  }
};

const API = {
  logIn,
  getUserInfo,
  logOut,
  getUser,
  updateUser,
  getRestaurants,
  getRestaurant,
  getInsertedRestaurant,
  getFilteringInfos,
  getIngredient,
  getFilters,
  getDish,
  createRestaurant,
  editRestaurant,
  deleteRestaurant,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByUser
};
export default API;