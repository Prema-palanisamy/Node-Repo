// const mysql = require('mysql2'); //mysql
// const express = require('express');
// const multer = require('multer');
// const { Storage } = require('@google-cloud/storage');
// const path = require('path');
// const cors = require('cors');
// const app = express();
// const port = process.env.PORT || 8080; // Cloud Run typically uses port 80

// // Replace these with your details
// const dbUser = "Prema";
// const dbPassword = "Admin@123";
// const dbName = "votecast";
// const host = "35.226.63.141"; 


// // Create a storage client - code here added
// const storage = new Storage({
//   keyFilename: 'D:config.json', // Replace with the path to your service account key file
// });

// const bucketName = 'my-project1-loadfile-storage'; // Replace with your bucket name
// const bucket = storage.bucket(bucketName);

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
// });


// app.use(cors({
//     origin: 'http://localhost:4200' // Replace with your Angular app's URL
//   }));

// app.post('/upload', upload.single('file'), (req, res) => {
//     console.log("post", req.file)
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const blob = bucket.file(req.file.originalname);
//   const blobStream = blob.createWriteStream({
//     metadata: {
//       contentType: req.file.mimetype,
//     },
//   });

//   blobStream.on('error', (err) => {
//     console.log("error");
//     res.status(500).send(err);
//   });

//   blobStream.on('finish', () => {
//     console.log("finish");
//     res.status(200).send({success : 'File uploaded successfully.'});
//   });

//   blobStream.end(req.file.buffer);
// });

// // Create a connection to the database
// const connection = mysql.createConnection({
//   host: host,
//   user: dbUser,
//   password: dbPassword,
//   database: dbName
// });

// // SQL INSERT query
// const insertQuery = "INSERT INTO vote_table (tabvote, spacevote) VALUES (?, ?)";


// app.get('/', (req, res) => {
//   const i1 = req.query.tabvote || 104; // Default to 'Guest' if name is not provided
//   const i2 = req.query.spacevote || 105;
//   const data = [i1,i2];
//   connection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to the database:', err);
//       return;
//     }
//     console.log('Connected to the database');
  
//     // Execute the INSERT command
//     connection.query(insertQuery, data, (error, results) => {
//       if (error) {
//         console.error('Error executing query:', error);
//         return;
//       }
//       console.log('Inserted row ID:', results.insertId);
  
//       // Close the connection
//       connection.end();
//     });
//   });

//   res.send(` ${i1} are ${i2} Saved.`);
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });



const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mysql = require('mysql2');
// const multer = require('multer');
// const { Storage } = require('@google-cloud/storage');
// const path = require('path');

// Replace these with your details
const dbUser = "Prema";
const dbPassword = "Admin@123";
const dbName = "votecast";
const host = "35.226.63.141"; 

// Create a connection to the database/
const connection = mysql.createConnection({
  host: host,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

app.get('/',(req, res) => {
    connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database');
  })
  res.send("file detected successfully")
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});