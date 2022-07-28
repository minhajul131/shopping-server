const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lw8h6rv.mongodb.net/?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 3200;

app.get('/', (req, res) => {
  res.send('Hello Database!')
})


// const client = new MongoClient(uri, { useUnifiedTopology: true}, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const productscollection = client.db("shoppingfull").collection("products");
  const ordersCollection = client.db("shoppingfull").collection("orders");
  
  app.post('/addProduct',(req, res) => {
    const product = req.body;
    productscollection.insertOne(product)
    .then(result => {
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
    productscollection.find({})
    .toArray((err, document) => {
      console.log(err)
      res.send(document);
    })
  })

  app.get('/products/:key', (req, res) => {
    productscollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productscollection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder',(req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0)
    })
  })
  
});


app.listen( process.env.PORT || port)