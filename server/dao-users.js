'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('./db');

// This function is used at "log-in" time to verify username.
exports.getUser = (username) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username=?';
    db.get(sql, [username], (err, row) => {
      // if query error, reject the promise, otherwise if no changes return false else return the user
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      }
      else {
        // return the user
        const user = { username: row.username, position: row.position, isRestaurateur: row.isRestaurateur };
        resolve(user);
      }
    });
  });
};

// This function update a specific user given its infos.
exports.updateUser = (user) => {
  return new Promise((resolve, reject) => {
      const sql = 'UPDATE users SET position=?,isRestaurateur=? WHERE username=?';
      db.run(sql,
          [user.position,user.isRestaurateur,user.username],
          function (err) {
              // if query error, reject the promise, otherwise if not found return an error else return the content
              if (err) {
                  reject(err);
              } else if (this.changes !== 1) {
                  resolve({ error: 'No user was updated.' });
              }
              else {
                  resolve(exports.getUser(user.username));
              }
          });
  });
};