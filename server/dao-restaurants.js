'use strict';

/* Data Access Object (DAO) module for accessing restaurants data */

const db = require('./db');

// This function returns all restaurants for the home page.
exports.getRestaurants = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT restaurants.id, restaurants.image AS image,restaurants.name AS name, restaurants.location AS location,' +
            'AVG(reviews.quality) AS avg_quality,AVG(reviews.safety) AS avg_safety,AVG(reviews.price) AS avg_price ' +
            'FROM restaurants LEFT JOIN reviews ON restaurants.id = reviews.restaurantId GROUP BY restaurants.id, restaurants.image, restaurants.name';
        db.all(sql, [], (err, rows) => {
            // if query error, reject the promise, otherwise return the content
            if (err) {
                reject(err);
            } else {
                // put together quality and safety average
                const restaurants = rows.map(restaurant => ({ id: restaurant.id, image: restaurant.image, location: restaurant.location, name: restaurant.name, avg_quality: restaurant.avg_quality, avg_safety: restaurant.avg_safety, avg_price: restaurant.avg_price }));
                resolve(restaurants);
            }
        });
    });
};

// This function returns a restaurant given his id.
exports.getRestaurant = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM restaurants WHERE id=?';
        db.get(sql, [id], (err, row) => {
            // if query error, reject the promise, otherwise if not found return an error else return the content
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'Restaurant not found.' });
            }
            else {
                const restaurant = Object.assign({}, row);
                resolve(restaurant);
            }
        });
    });
};

// This function returns a restaurant image path given his id.
exports.getRestaurantImage = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT image FROM restaurants WHERE id=?';
        db.get(sql, [id], (err, row) => {
            // if query error, reject the promise, otherwise if not found return an error else return the content
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'Restaurant not found.' });
            }
            else {
                const restaurant = Object.assign({}, row);
                resolve(restaurant);
            }
        });
    });
};

// This function create a new restaurant.
exports.insertRestaurant = (restaurant) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO restaurants (isNewInserted, image, name, location, phone, website, facebook, instagram, twitter, hours, description)' +
            ' VALUES(1,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql,
            [restaurant.image, restaurant.name, restaurant.location, restaurant.phone, restaurant.website,
            restaurant.facebook, restaurant.instagram, restaurant.twitter, restaurant.hours, restaurant.description],
            function (err) {
                // if query error, reject the promise, otherwise return the content
                if (err) {
                    reject(err);
                } else {
                    // Returning the success message to the client.
                    resolve(exports.getRestaurant(this.lastID));
                }
            });
    });
};

// This function update a specific restaurant given its id and infos.
exports.updateRestaurant = (restaurant) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE restaurants SET image=?, name=?, location=?,' +
            ' phone=?, website=?, facebook=?, instagram=?, twitter=?, hours=?, description=? WHERE id=?';
        db.run(sql,
            [restaurant.image, restaurant.name, restaurant.location, restaurant.phone, restaurant.website,
            restaurant.facebook, restaurant.instagram, restaurant.twitter, restaurant.hours, restaurant.description, restaurant.id],
            function (err) {
                // if query error, reject the promise, otherwise if not found return an error else return the content
                if (err) {
                    reject(err);
                } else if (this.changes !== 1) {
                    resolve({ error: 'No restaurant was updated.' });
                }
                else {
                    resolve(exports.getRestaurant(restaurant.id));
                }
            });
    });
};

// This function delete a specific restaurant given its id.
exports.deleteRestaurant = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM restaurants WHERE id=?';
        db.run(sql, [id], function (err) {
            // if query error, reject the promise, otherwise if no changes return an error else return the content
            if (err) {
                reject(err);
            } else if (this.changes !== 1) {
                resolve({ error: 'No restaurant deleted.' });
            } else {
                resolve({ success: 'Restaurant deleted successfully.' });
            }
        });
    });
};