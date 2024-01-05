'use strict';

/* Data Access Object (DAO) module for accessing restaurants data */

const db = require('./db');

// This function returns all ingredients for a given dish.
exports.getIngredients = (dishId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from ingredients WHERE dishId=?';
    db.all(sql, [dishId], (err, rows) => {
      // if query error, reject the promise, otherwise return the content
      if (err) {
        reject(err);
      } else {
        // put together quality and safety average
        //const ingredients = rows.map(ingredient => ({ id: ingredient.id, name: ingredient.name }));
        resolve(rows);
      }
    });
  });
};

// This function returns a ingredient given his id.
exports.getIngredient = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ingredients WHERE id=?';
    db.get(sql, [id], (err, row) => {
      // if query error, reject the promise, otherwise if not found return an error else return the content
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: 'Ingredient not found.' });
      }
      else {
        const ingredient = Object.assign({}, row);
        resolve(ingredient);
      }
    });
  });
};

// This function returns an ingredient image path given his id.
exports.getIngredientImage = (id) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT image FROM ingredients WHERE id=?';
      db.get(sql, [id], (err, row) => {
          // if query error, reject the promise, otherwise if not found return an error else return the content
          if (err) {
              reject(err);
          } else if (row === undefined) {
              resolve({ error: 'Ingredient not found.' });
          }
          else {
              const ingredient = Object.assign({}, row);
              resolve(ingredient);
          }
      });
  });
};

// This function returns all the images of the ingredients.
exports.getAllIngredientsImages = (dishId) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT image FROM ingredients where dishId=?';
      db.all(sql, [dishId], (err, rows) => {
          // if query error, reject the promise, otherwise return the content
          if (err) {
              reject(err);
          } else {
              resolve(rows.map((row) => row.image));
          }
      });
  });
};

// This function create a new ingredient.
exports.insertIngredient = (ingredient) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO ingredients (dishId, image, name, allergens, brandName, brandLink)' +
      ' VALUES(?, ?, ?, ?, ?, ?)';
    db.run(sql,
      [ingredient.dishId, ingredient.image, ingredient.name, ingredient.allergens, ingredient.brandName, ingredient.brandLink],
      function (err) {
        // if query error, reject the promise, otherwise return the content
        if (err) {
          reject(err);
        } else {
          // Returning the success message to the client.
          resolve(exports.getIngredient(this.lastID));
        }
      });
  });
};

/*
// This function update a specific Ingredient given its id and infos.
exports.updateIngredient = (ingredient) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE ingredients SET dishId=?, image=?, name=?, allergens=?, brandName=?, brandLink=? WHERE id=?';
    db.run(sql,
      [ingredient.dishId, ingredient.image, ingredient.name, ingredient.allergens, ingredient.brandName, ingredient.brandLink, ingredient.id],
      function (err) {
        // if query error, reject the promise, otherwise if not found return an error else return the content
        if (err) {
          reject(err);
        } else if (this.changes !== 1) {
          resolve({ error: 'No ingredient was updated.' });
        }
        else {
          resolve(exports.getIngredient(ingredient.id));
        }
      });
  });
};


// This function deletes all dish ingredients given the dish id.
exports.deleteAllDishIngredients = (dishId) => {
  return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM ingredients WHERE dishId=?';
      db.run(sql, [dishId], function (err) {
          // if query error, reject the promise, otherwise if no changes return an error else return the content
          if (err) {
              reject(err);
          } else if (this.changes === 0) {
              resolve({ error: 'No ingredients deleted.' });
          } else {
              resolve(this.changes);
          }
      });
  });
};
*/

// This function delete a specific ingredient given its id.
exports.deleteIngredient = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM ingredients WHERE id=?';
    db.run(sql, [id], function (err) {
      // if query error, reject the promise, otherwise if no changes return an error else return the content
      if (err) {
        reject(err);
      } else if (this.changes !== 1) {
        resolve({ error: 'No ingredient deleted.' });
      } else {
        resolve({ success: 'Ingredient deleted successfully.' });
      }
    });
  });
};