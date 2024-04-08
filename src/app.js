import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import routes from './routers/routes';

const { syncDatabase } = require('./config/db');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class App {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.configureSwagger();
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

  configureSwagger() {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'API Documentation',
          version: '1.0.0',
          description: 'Documentation for the API endpoints',
        },
        servers: [
          {
            url: 'http://localhost:80',
            description: 'Development server',
          },
        ],
      },
      apis: [path.resolve(__dirname, './routers/routes.js')],
    };

    const specs = swaggerJsdoc(options);
    this.express.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }
}

export default new App().express;
