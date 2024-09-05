const { Client, DatabaseError } = require('pg');
require('dotenv').config();
const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const app = express();
const port = process.env.PORT || 8080; 
const cors = require('cors');
const logger = require('./logger');
const pubsub = new PubSub();
const topicName = 'my-topic'; 
const multer = require('multer');
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This is necessary for Cloud SQL
  },
});
const secretClient = new SecretManagerServiceClient();

async function getCredentials() {
  const [version] = await secretClient.accessSecretVersion({
    name: "projects/794505579581/secrets/node-secret1/versions/2", // Replace with your secret name 
  });
  const payload = version.payload.data.toString("utf8");
  return JSON.parse(payload);
}
 
// Function to initialize Google Cloud Storage with credentials from Secret Manager
async function initializeStorage() {
  const credentials = await getCredentials();
  const storage = new Storage({
    projectId: "coral-style-433606-t0",
    credentials,
  });
  return storage.bucket("upload-node-angular");
}
 

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

async function publishMessage() {
  console.log("pub/sub message called")
  const topic = pubsub.topic('my-topic');
const data = Buffer.from('Hello, world!');

const callback = (err, messageId) => {
  if (err) {
    console.error('Error publishing message:', error);
  } else {
    console.log(`Message ${messageId} published.`);
  }
};

topic.publish(data, callback);
}

//   console.log("data buffer " , dataBuffer);
//   try {
    
//   await pubsub.topic(topicName).publish(data).then((messageId) => {});
//     console.log(`Message ${messageId} published.`);
//   } catch (error) {
//     console.error('Error publishing message:', error);
//   }
// }



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
      logger.info('Application has started');
    } catch (err) {
      console.error('Error:', err.stack);
    }     
  }
  setupDatabase();

app.use(cors({
    origin: '*' // Replace with your Angular app's URL
  }));
  app.get('/', async (req, res) => {
    publishMessage();
    try {
        // const selectQuery = 'SELECT * FROM vote_table;'
        // const res = await client.query(selectQuery)
      const result = await client.query('SELECT * FROM vote_table;');
      logger.info('Received a GET request to node');
      // console.table(result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error('Error retrieving data:', err.stack);
      res.status(500).send('Server error');
    }
  });

app.use(express.json());
app.post('/upload', async (req, res) => {
  console.log("req.body : ", req.body)
  const { tabvote, castvote } = req.body;
  console.log('Received data:', { tabvote, castvote });
  const insertQuery = `
        INSERT INTO vote_table (tabvote, castvote) 
        VALUES ($1, $2)
      `;
      await client.query(insertQuery, [tabvote, castvote]);
      console.log('Data inserted successfully');
  res.status(200).json({ message: 'Data received successfully' });
});

app.put('/delete', async (req, res) => {
  console.log("delete : ", req.body)
  const { id } = req.body;
  if (id === undefined) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const deleteQuery = `
     DELETE FROM vote_table 
    WHERE id = $1
  `;
  try {
     const result = await client.query(deleteQuery, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    console.log('Data deleted successfully');
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/file', upload.single('file'), async (req, res) => {
    console.log("post", req.file)
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const bucket = await initializeStorage();
    console.log("File found, trying to upload...");
 
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

  blobStream.on('error', (err) => {
    console.log("error");
    res.status(500).send(err);
  });

  blobStream.on('finish', () => {
    console.log("finish");
    res.status(200).send({success : 'File uploaded successfully.'});
  });

  blobStream.end(req.file.buffer);
});

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
