const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt =require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res)=>{
 res.send('traveller server runing')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y2sfurg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
if(!authHeader){
 return res.status(401).send({message: 'unauthorized access'})
}
const token = authHeader.split(' ')[1];
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
  if(err){
 return   res.status(401).send({message: 'unAuthorized access'})
  }
  req.decoded = decoded;
  next();
})
} 
async function run(){
 try{
const travelCollection = client.db('traveller').collection('services')
const ordersCollection = client.db('traveller').collection('order')


app.post('/jwt', async(req, res)=>{
  const user =req.body;
  // console.log(user)
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
  res.send({token})
})

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
app.get('/services/:id', async(req, res)=>{
  const id =req.params.id
  const query = {_id: ObjectId(id)}
  const cursor = await travelCollection.findOne(query)
  res.send(cursor)
})
app.post('/orders', async(req, res)=>{
const order =req.body;
const result = await ordersCollection.insertOne(order)
res.send(result)
}),
app.get('/orders', verifyJWT, async(req, res)=>{
const decoded = red.decoded;

 console.log('api',decoded)
 if(decoded.email !== req.query.email){
  return res.status(403).send({message: 'unauthorized access'})
 }
 

  let query = {}
  if(req.query.email){
    query = {
      email: req.query.email
    }
  }
  const cursor = ordersCollection.find(query)
  const orders = await cursor.toArray();
  res.send(orders)
})
app.delete('/orders/:id', verifyJWT, async(req, res)=>{
  const id =req.params.id;
  const query ={_id: ObjectId(id)}
  const cursor = await ordersCollection.deleteOne(query)
  res.send(cursor)
})




 }
 finally{

 }
}
run().catch(error=>console.log(error))





app.listen(port, (req, res)=>{
console.log(`traveller server port ${port}`)
})

