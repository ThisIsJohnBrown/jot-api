import {Router, Request, Response, NextFunction} from 'express';
import * as firebase from 'firebase';
import * as winston from 'winston';
import {autobind} from 'core-decorators';

import * as fs from 'fs';

export class HeroRouter {
  router: Router;
  firebase: any;

  constructor() {
    this.router = Router();
    this.init();
  }

  public setFirebase(firebase): void {
    this.firebase = firebase;
  }

  @autobind
  public testFirebase(req:Request, res:Response, next: NextFunction): void {
    res.setHeader('Content-Type', 'application/json');
    this.firebase.database().ref('heroes').once('value')
      .then(function(snapshot) {
        res.status(200)
          .send({
            message: 'success',
            status: res.status
          });
      })
      .catch(() => {
        res.status(404)
          .send({
            message: 'failure',
            status: res.status
          });
      });
  }

  @autobind
  public getAll(req:Request, res:Response, next: NextFunction): void {
    res.setHeader('Content-Type', 'application/json');
    this.firebase.database().ref('heroes').once('value').then(function(snapshot) {
      let heroes = snapshot.val();
      heroes = heroes.filter((val, i) => !(val === null))
      res.send(heroes);
    });
  }

  @autobind
  public getOne(req:Request, res:Response, next: NextFunction): void {
    let query = parseInt(req.params.id);
    this.firebase.database().ref(`heroes/${query}`).once('value')
      .then((snapshot) => {
        let hero = snapshot.val();
        if (hero) {
          res.status(200)
            .send({
              message: 'success',
              status: res.status,
              hero
            })
        } else {
          res.status(404)
            .send({
              message: 'No hero found with the given id.',
              status: res.status
            })
        }
      })
      .catch(() => {
        res.status(404)
          .send({
            message: 'No hero found with the given id.',
            status: res.status
          })
      })
  }

  init(): void {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);

    this.router.get('/test/firebase', this.testFirebase);
  }
}

export default new HeroRouter();