import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import routes from './routers/routes';

const { syncDatabase } = require('./config/db');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class App {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    syncDatabase();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors());
  }

  routes() {
    this.express.use(routes);
  }
}

export default new App().express;
