const { Client } = require('pg');
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080; 
const cors = require('cors');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This is necessary for Cloud SQL
  },
});

// client.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch(err => console.error('Connection error', err.stack));

  async function setupDatabase() {
    try {
      await client.connect();
  
      // Create table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS vote_table (
          id SERIAL PRIMARY KEY,
          tabvote INT,
          castvote INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await client.query(createTableQuery);
    //   console.log('Table created successfully');
  
    //   // Insert data
    //   const insertQuery = `
    //     INSERT INTO vote_table (tabvote, castvote) 
    //     VALUES (101, 102)
    //   `;
    //   await client.query(insertQuery);
    //   console.log('Data inserted successfully');
    //    // Define the SELECT query
    // const selectQuery = 'SELECT * FROM vote_table;';

    // // Execute the query
    // const res = await client.query(selectQuery);

    // // Log the results
    // console.log('Data retrieved successfully:');
    // console.table(res.rows);
    } catch (err) {
      console.error('Error:', err.stack);
    } 
    // finally {
    //   await client.end();
    // }
  }
  setupDatabase();

app.use(cors({
    origin: 'http://localhost:4200' // Replace with your Angular app's URL
  }));
  app.get('/', async (req, res) => {
    try {
        // const selectQuery = 'SELECT * FROM vote_table;'
        // const res = await client.query(selectQuery)
      const result = await client.query('SELECT * FROM vote_table;');
      console.table(result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error('Error retrieving data:', err.stack);
      res.status(500).send('Server error');
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
// Use client.query() to execute SQL queries
