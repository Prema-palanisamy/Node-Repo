const mysql = require('mysql2');

// Replace these with your details
const dbUser = "prema";
const dbPassword = "Admin@123";
const dbName = "votecast";
const host = "34.134.153.25";

// Create a connection to the database
const connection = mysql.createConnection({
  host: host,
  user: dbUser,
  password: dbPassword,
  database: dbName
});

// SQL INSERT query
const insertQuery = "INSERT INTO vote_table (tabvote, spacevote) VALUES (?, ?)";
const data = [1, 1];

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  // Execute the INSERT command
  connection.query(insertQuery, data, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return;
    }
    console.log('Inserted row ID:', results.insertId);

    // Close the connection
    connection.end();
  });
});