import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as firebase from 'firebase';
import * as fs from 'fs';
import * as winston from 'winston';

import Jot from './Jot';
import {Sensor, TemperatureSensor} from './Sensor';

const config = require('../config');

var logger = config.winston.access;

(logger as any).stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

import JotRouter from './routes/JotRouter';

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

    let jot:Jot = new Jot('elkhead', ['temperature', 'noise']);
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(require("morgan")("combined", { "stream": logger.stream }));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    JotRouter.setFirebase(this.firebase);
    this.express.use('/api/v1', JotRouter.router);
  }

}

export default new App().express;