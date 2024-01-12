const express = require("express");
const api = express();
const db = require("./db/models");
const users = require('./controllers/users');
const cors = require('cors');

api.use(express.json());
api.use('/', users);

const port = 3440;

api.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

api.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

api.listen(process.env.PORT || port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});