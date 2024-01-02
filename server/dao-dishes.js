'use strict';

/* Data Access Object (DAO) module for accessing dishes data */

const db = require('./db');

// This function returns all the dishes of a given restaurant.
exports.getDishes = (restaurantId) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT id,name,price,type,image FROM dishes WHERE restaurantId=?';
      db.all(sql, [restaurantId], (err, rows) => {
          // if query error, reject the promise, otherwise return the content
          if (err) {
              reject(err);
          } else {
              const dishes = rows.map(dish => ({ id:dish.id, name: dish.name, price:dish.price, type:dish.type, image: dish.image }));
              resolve(dishes);
          }
      });
  });
};

// This function returns all restaurants for the home page.
exports.getDishesAvgPrice = (restaurantId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT AVG(price) as average from dishes where restaurantId=?';
        db.all(sql, [restaurantId], (err, rows) => {
            // if query error, reject the promise, otherwise return the content
            if (err) {
                reject(err);
            } else {
                // put together quality and safety average
                const average = rows[0].average;
                resolve(average);
            }
        });
    });
};

// This function returns a dish given his id.
exports.getDish = (id) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM dishes WHERE id=?';
      db.get(sql, [id], (err, row) => {
          // if query error, reject the promise, otherwise if not found return an error else return the content
          if (err) {
              reject(err);
          } else if (row === undefined) {
              resolve({ error: 'Dish not found.' });
          }
          else {
              const dish = Object.assign({}, row);
              resolve(dish);
          }
      });
  });
};

// This function returns the image path of a dish given his id.
exports.getDishImage = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT image FROM dishes WHERE id=?';
        db.get(sql, [id], (err, row) => {
            // if query error, reject the promise, otherwise if not found return an error else return the content
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'Dish not found.' });
            }
            else {
                const dish = Object.assign({}, row);
                resolve(dish);
            }
        });
    });
};

// This function returns all the images of the dishes of a given restaurant.
exports.getAllDishesImages = (restaurantId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id,image FROM dishes where restaurantId=?';
        db.all(sql, [restaurantId], (err, rows) => {
            // if query error, reject the promise, otherwise return the content
            if (err) {
                reject(err);
            } else {
                resolve(rows.map((row) => ({id: row.id, image: row.image})));
            }
        });
    });
};

// This function returns all the possible type of dishes, for filter in the home page.
exports.getFilters = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT(type) FROM dishes';
        db.all(sql, [], (err, rows) => {
            // if query error, reject the promise, otherwise return the content
            if (err) {
                reject(err);
            } else {
                const filters = rows.map(filter => (filter.type));
                resolve(filters);
            }
        });
    });
};

// This function returns the possible type of dishes for a given restaurant from his id, for filter in the home page.
exports.getRestaurantFilters = (restaurantId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT(type) FROM dishes where restaurantId=?';
        db.all(sql, [restaurantId], (err, rows) => {
            // if query error, reject the promise, otherwise return the content
            if (err) {
                reject(err);
            } else {
                const filters = rows.map(filter => (filter.type));
                resolve(filters);
            }
        });
    });
};

// This function create a new dish.
exports.insertDish = (dish) => {
  return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO dishes (restaurantId, name, price, type, image)' +
          ' VALUES(?, ?, ?, ?, ?)';
      db.run(sql,
          [dish.restaurantId,dish.name,dish.price,dish.type,dish.image],
          function (err) {
              // if query error, reject the promise, otherwise return the content
              if (err) {
                  reject(err);
              } else {
                  // Returning the success message to the client.
                  resolve(exports.getDish(this.lastID));
              }
          });
  });
};

/*
// This function update a specific dish given its id and infos.
exports.updateDish = (dish) => {
  return new Promise((resolve, reject) => {
      const sql = 'UPDATE dishes SET restaurantId=?, name=?, price=?, type=?, image=? WHERE id=?';
      db.run(sql,
          [dish.restaurantId,dish.name,dish.price,dish.type,dish.image,dish.id],
          function (err) {
              // if query error, reject the promise, otherwise if not found return an error else return the content
              if (err) {
                  reject(err);
              } else if (this.changes !== 1) {
                  resolve({ error: 'No Dish was updated.' });
              }
              else {
                  resolve(exports.getDish(dish.id));
              }
          });
  });
};
*/

// This function deletes all restaurant dishes given the restaurant id.
exports.deleteAllRestaurantDishes = (restaurantId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM dishes WHERE restaurantId=?';
        db.run(sql, [restaurantId], function (err) {
            // if query error, reject the promise, otherwise if no changes return an error else return the content
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                resolve({ error: 'No dishes deleted.' });
            } else {
                resolve(this.changes);
            }
        });
    });
};

// This function delete a specific dish given its id.
exports.deleteDish = (id) => {
  return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM dishes WHERE id=?';
      db.run(sql, [id], function (err) {
          // if query error, reject the promise, otherwise if no changes return an error else return the content
          if (err) {
              reject(err);
          } else if (this.changes !== 1) {
              resolve({ error: 'No Dish deleted.' });
          } else {
              resolve({ success: 'Dish deleted successfully.' });
          }
      });
  });
};