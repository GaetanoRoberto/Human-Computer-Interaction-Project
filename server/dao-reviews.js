'use strict';

/* Data Access Object (DAO) module for accessing restaurants data */

const db = require('./db');

// This function returns all reviews for a given restaurant.
exports.getReviews = (restaurantId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id,username,date,title,quality,safety,price,description FROM reviews WHERE restaurantId=?';
        db.all(sql, [restaurantId], (err, rows) => {
            // if query error, reject the promise, otherwise return the content
            if (err) {
                reject(err);
            } else {
                // put together quality and safety by doing average
                const reviews = rows.map(review => ({ id: review.id, username: review.username, date: review.date, title: review.title, quality: review.quality, safety:review.safety, price: review.price, description: review.description }));
                resolve(reviews);
            }
        });
    });
};

// This function returns a review given his id.
exports.getReview = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM reviews WHERE id=?';
        db.get(sql, [id], (err, row) => {
            // if query error, reject the promise, otherwise if not found return an error else return the content
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'Review not found.' });
            }
            else {
                const review = Object.assign({}, row);
                resolve(review);
            }
        });
    });
};

// This function returns a review given the username.
exports.getReviewsByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM reviews WHERE username=?';
        db.all(sql, [username], (err, rows) => {
            // if query error, reject the promise, otherwise return the content
            if (err) {
                reject(err);
            } else {
                // return
                resolve(rows);
            }
        });
    });
};

// This function returns a review given an username and a restaurantId, to see if there is already a review.
exports.checkReview = (username,restaurantId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) as count FROM reviews WHERE username=? AND restaurantId=?';
        db.get(sql, [username,restaurantId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row.count !== 0) {
                resolve({ error : `${row.count} Review found.` });
            } else {
                resolve({ success: 'No Review found.' });
            }
        });
    });
};

// This function create a new review.
exports.insertReview = (review) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO reviews (username, restaurantId, date, title, description, quality, safety, price)' +
            ' VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql,
            [review.username,review.restaurantId,review.date,review.title,review.description,review.quality,review.safety,review.price],
            function (err) {
                // if query error, reject the promise, otherwise return the content
                if (err) {
                    reject(err);
                } else {
                    // Returning the success message to the client.
                    resolve(exports.getReview(this.lastID));
                }
            });
    });
};

// This function update a specific review given its id and infos.
exports.updateReview = (review) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE reviews SET username=?, restaurantId=?, date=?, title=?, description=?, quality=?, safety=?, price=? WHERE id=?';
        db.run(sql,
            [review.username,review.restaurantId,review.date,review.title,review.description,review.quality,review.safety,review.price,review.id],
            function (err) {
                // if query error, reject the promise, otherwise if not found return an error else return the content
                if (err) {
                    reject(err);
                } else if (this.changes !== 1) {
                    resolve({ error: 'No review was updated.' });
                }
                else {
                    resolve(exports.getReview(review.id));
                }
            });
    });
};

// This function delete a specific review given its id.
exports.deleteReview = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM reviews WHERE id=?';
        db.run(sql, [id], function (err) {
            // if query error, reject the promise, otherwise if no changes return an error else return the content
            if (err) {
                reject(err);
            } else if (this.changes !== 1) {
                resolve({ error: 'No review deleted.' });
            } else {
                resolve({ success: 'Review deleted successfully.' });
            }
        });
    });
};