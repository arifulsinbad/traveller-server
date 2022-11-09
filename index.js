const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res)=>{
 res.send('traveller server runing')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y2sfurg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
 try{
const travelCollection = client.db('traveller').collection('services')
app.get('/services', async(req, res)=>{
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);
  console.log(page, size)
  const query = {}
  const cursor = travelCollection.find(query)
  const result = await cursor.limit(size).toArray()
  const count =await travelCollection.estimatedDocumentCount();
  res.send({count, result})
})
 }
 finally{

 }
}
run().catch(error=>console.log(error))





app.listen(port, (req, res)=>{
console.log(`traveller server port ${port}`)
})

