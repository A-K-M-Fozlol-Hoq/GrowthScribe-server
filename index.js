//external imports
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 4000;

const app = express();
require('dotenv').config();

//database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlclv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  keepAlive: 1,
});
//middlewars
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

client.connect((err) => {
  const userCollection = client.db('GrowthScribe').collection('usersData');

  app.post('/addUser', (req, res) => {
    // fullName,email, age, address, phone, role, nid, profile,vehicleType
    const name = req.body.name;
    const email = req.body.email;
    const details = req.body.details;
    userCollection
      .insertOne({
        name,
        email,
        details,
      })
      .then((result) => {
        // console.log(result);
        res.send(result.acknowledged);
      });
  });

  app.get('/getUsers', (req, res) => {
    userCollection
      .find({})
      .toArray()
      .then((response) => {
        res.send(response);
      })
      .catch((err) => console.log(err));
  });

  console.log('database connected successfully');
  // client.close();
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
