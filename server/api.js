const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./mongodb');
const assert = require('assert');

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
/*
app.get('/products', async (request, response) => {
  await db.connect();
  var prod= await db.find();
  var dict ={};
  dict["success"]=true
  var dict2={}
  dict2["result"]=prod;

  const paginate = (currentPage, count, rows, pageLimit = 20) => {
    const meta = {
      currentPage: Number(currentPage) || 1,
      pageCount: Math.ceil(count / Number(pageLimit)),
      pageSize: rows.length,
      count
    };
    return meta;
  };
  const calculateLimitAndOffset = (currentPage, pageLimit = 12) => {
    const offset = (currentPage ? Number(currentPage) - 1 : 0) * Number(pageLimit);
    const limit = Number(pageLimit);
    return { offset, limit };
  };
    const count = prod.length
    const { limit, offset } = calculateLimitAndOffset(1)
    const rows = prod.slice(offset, offset + limit)
    const meta = paginate(1, count, rows)
    dict2["meta"]=meta;
    dict["data"]=dict2;
  
  response.send(dict);
});
*/

app.get('/products/:search', async(request, response) => {
  
  await db.connect();
  var prod= await db.find();

  const paginate = (currentPage, count, rows, pageLimit ) => {
    const meta = {
      currentPage: Number(currentPage) ,
      pageCount: Math.ceil(count / Number(pageLimit)),
      pageSize: rows.length,
      count
    };
    return meta;
  };
  const calculateLimitAndOffset = (currentPage, pageLimit) => {
    const offset = (currentPage ? Number(currentPage) - 1 : 0) * Number(pageLimit);
    const limit = Number(pageLimit);
    return { offset, limit };
  };
    const count = prod.length
    const { limit, offset } = calculateLimitAndOffset(parseInt(request.query.page),parseInt(request.query.size))
    const rows = prod.slice(offset, offset + limit)
    const meta = paginate(parseInt(request.query.page), count, rows,parseInt(request.query.size))
    
  
  prod=prod.slice(((parseInt(request.query.page)*parseInt(request.query.size))-parseInt(request.query.size)),(parseInt(request.query.page)*parseInt(request.query.size)));

  var dict ={};
  dict["success"]=true;
  var dict2={}
  dict2["result"]=prod;
  dict2["meta"]=meta;
  dict["data"]=dict2;
  
  //response.send(dict);
  
  
  response.send(dict);

});

//search?limit=5&brand=montlimart&price=50

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
