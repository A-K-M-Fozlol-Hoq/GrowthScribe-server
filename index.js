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
    const fullName = req.body.fullName;
    const email = req.body.email;
    const age = req.body.age;
    const address = req.body.address;
    const phone = req.body.phone;
    const role = req.body.role;
    const nid = req.body.nid;
    const profile = req.body.profile;
    const vehicleType = req.body.vehicleType;
    console.log(req.body);
    userCollection.find({ email: email }).toArray((err, users) => {
      userCollection
        .insertOne({
          fullName,
          email,
          age: parseInt(age),
          address,
          phone,
          role,
          nid,
          profile,
          vehicleType,
        })
        .then((result) => {
          // console.log(result);
          res.send(result.acknowledged);
        });
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
