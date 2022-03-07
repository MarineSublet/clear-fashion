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

app.get('/products/:id', async (request, response) => {
  await db.connect();
  response.send(await  db.find({"_id":request.params.id}));
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
