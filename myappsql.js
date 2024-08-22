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


const express = require('express');
const app = express();
const port = process.env.PORT || 8080; // Cloud Run typically uses port 8080

app.get('/', (req, res) => {
  const i1 = req.query.tabvote || 100; // Default to 'Guest' if name is not provided
  const i2 = req.query.spacevote || 101;
  const data = [i1,i2];
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

  res.send(` ${i1} are ${i2} Saved.`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
