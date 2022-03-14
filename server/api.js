const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./mongodb');


const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products', async (request, response) => {
  await db.connect();
  response.send(await  db.find());
});




app.get('/products/:search', async (request, response) => {
  await db.connect();
  var dict={}
  if(request.query.brand!=null) {dict["brand"]=request.query.brand}
  if(request.query.price!=null) {dict["price"]=parseFloat(request.query.price)}
  if(request.query.limit!=null) {var limit=parseInt(request.query.limit)}
  
  else {limit=12}
  //dict["$orderby"]="{ price : -1 }";
  
  var result=await  db.find(dict)//.sort( { price: -1 } )
  result.sort((a, b) => {
    return a.price - b.price;})
  result=result.slice(0,limit)
  response.send(result);
  
});

app.get('/products/:id', async (request, response) => {
  await db.connect();
  console.log(request.params.id)
  response.send(await  db.find({"_id":request.params.id}));
});

//search?limit=5&brand=montlimart&price=50

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
