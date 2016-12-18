import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as firebase from 'firebase';
import * as fs from 'fs';
import * as winston from 'winston';
const config = require('../config');

var logger = config.winston.access;

(logger as any).stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

import HeroRouter from './routes/HeroRouter';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;
  public firebase;

  //Run configuration methods on the Express instance.
  constructor() {
    this.firebase = firebase.initializeApp(config.firebase);

    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(require("morgan")("combined", { "stream": logger.stream }));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    HeroRouter.setFirebase(this.firebase);
    this.express.use('/api/v1/heroes', HeroRouter.router);
  }

}

export default new App().express;