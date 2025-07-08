const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/productRouter');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);

module.exports = app;