'use strict';

/** DB access module **/
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const retrieveIp = require('./retrieve-ip');
const IP_ADDRESS_AND_PORT = retrieveIp.getLocalWirelessIP();


// Path to your script.sql file and new SQLite database
const sqlScriptPath = './script.sql';
const dbPath = './glutenhub.sqlite';


// Remove the old database file if it exists and you want to reset it every time
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Existing file removed.');
}

// Create a new database instance
const db = new sqlite3.Database(dbPath);

//AGGIUNGIAMO GIà ADESSO The PRAGMA statement PER GARANTIRE CHE I VINCOLI DI FOREIGN KEY SIANO RISPETTATI GIà DALL'INIZIO
// Enable foreign keys by executing the PRAGMA statement
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');
});

// Read the SQL file
const templateSQL = fs.readFileSync(sqlScriptPath).toString();
const sqlScript = templateSQL.replace(/IP_ADDRESS_AND_PORT/g, IP_ADDRESS_AND_PORT);

// Run the SQL script within a transaction
db.serialize(() => {
  db.run('BEGIN TRANSACTION;');
  db.exec(sqlScript, (err) => {
    if (err) {
      console.error("Error executing SQL script:", err);
      db.run('ROLLBACK;');
    } else {
      db.run('COMMIT;', () => {
        console.log("Database initialized successfully.");
      });
    }
    // // Close the database connection
    // db.close();
  });
});


module.exports = db;