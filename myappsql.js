// const mysql = require('mysql2/promise');

// async function main() {
//     const pool = mysql.createPool({
//         socketPath: '/cloudsql/durable-circle-433106-g9:us-central1:spacevote-instance', // Ensure this path is correct
//         user: 'prema', // Use environment variables for sensitive information
//         password: 'Admin@123', // Use environment variables for sensitive information
//         database: 'votecast' // Use environment variables for sensitive information
//     });

//     try {
//         const [rows, fields] = await pool.query('SELECT * FROM vote_table');
//         console.log('Query results:', rows);
//     } catch (err) {
//         console.error('Error executing query:', err.stack);
//     } finally {
//         await pool.end();
//     }
// }

// main();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
const { Client } = require('pg'); // For PostgreSQL

// const app = express();
// const port = process.env.PORT || 3000;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

client.connect()
  .then(() => console.log('Connected to Cloud SQL'))
  .catch(err => console.error('Connection error', err.stack));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
