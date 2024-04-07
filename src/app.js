const express = require('express');
const cors = require('express');
const dotenv = require('dotenv');
const { syncDatabase } = require('./config/db');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class App {
  constructor() {
    this.express = express();
    this.middlewares();
    // this.routes();

    syncDatabase();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors());
  }

  // routes() {
  //   console.log('rota');
  // }
}

const appInstance = new App().express;

module.exports = appInstance;
