const express = require("express");
const api = express();
const db = require("./db/models");
const users = require('./controllers/users');
const cors = require('cors');

api.use(express.json());
api.use('/', users);

api.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

api.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));


api.listen(3440, () => {
  console.log("teste: http://localhost:3440");
});