import {Router, Request, Response, NextFunction} from 'express';
import * as firebase from 'firebase';
import * as winston from 'winston';
import * as url from 'url';
import {autobind} from 'core-decorators';

import * as fs from 'fs';

interface JotValues {
  jots?: Object,
  time?: string
}

export class JotRouter {
  router: Router;
  firebase: any;

  constructor() {
    this.router = Router();
    this.init();
  }

  public setFirebase(firebase): void {
    this.firebase = firebase;
  }

  private extractValues(snapshot:any, id?:number):{values:Array<JotValues>, keys:Array<string>} {
    const values:JotValues[] = snapshot.val();
    const keys:Array<string> = values ? Object.keys(values).sort() : [];
    let returnVals:Array<JotValues> = [];
    for(let i in values) {
      if (id) {
        if (values[i].jots['jot' + id] !== undefined) {
          returnVals.push(values[i].jots['jot' + id]);
        }
      } else {
        returnVals.push(values[i].jots);
      };
    };
    return {values: returnVals, keys};
  };

  private resSuccess(res: Response, values:Array<JotValues>, message:string, next:string) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200)
      .send({
        message,
        values,
        next,
        status: res.status
      });
  }

  private resFailure(res: Response, message:string) {
    winston.error(message);
    res.setHeader('Content-Type', 'application/json');
    res.status(404)
      .send({
        message,
        status: res.status
      });
  }

  private getNextParam(req: Request, values:Array<JotValues>, num:number, forward?:boolean):string {
    let start;
    if (forward) {
      winston.info(values[values.length - 1].time);
      start = parseInt(values[values.length - 1].time) + 1;
    } else {
      start = parseInt(values[0].time) - 1;
    }
    if (values.length === (num || 500)) {
      return `${req.protocol}://${req.get('host')}${url.parse(req.originalUrl).pathname}?start=${start}`;
    } else {
      return null;
    };
  }

  @autobind
  public getJots(req:Request, res:Response, next: NextFunction): void {
    let id = parseInt(req.params.id);
    this.firebase.database().ref('moments').orderByKey().limitToLast(1).once('value')
      .then((snapshot) => {
        const {values, keys} = this.extractValues(snapshot, id);
        if (values.length) {
          this.resSuccess(res, values, 'success', null);
        } else {
          if (id) {
            this.resFailure(res, 'No Jot with that id found.');
          } else {
            this.resFailure(res, 'Error retrieving data.');
          }
        }
      })
      .catch((err) => {
        this.resFailure(res, err);
      });
  }

  @autobind
  public getToday(req:Request, res:Response, next: NextFunction): void {
    res.setHeader('Content-Type', 'application/json');
    const id:number = parseInt(req.params.id);
    const num:number = parseInt(req.params.num);
    const start:string = req.query.start;

    const now:Date = new Date();
    const today:Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
    const todayStart:number = today.getTime();

    this.firebase.database().ref('moments').orderByKey().startAt(start || todayStart.toString()).limitToFirst(num || 500).once('value')
      .then((snapshot) => {
        const {values, keys} = this.extractValues(snapshot, id);
        if (values.length) {
          const nextParam:string = this.getNextParam(req, values, num || 500, true);
          this.resSuccess(res, values, 'success', nextParam);
        } else {
          if (id) {
            // TODO: Need to make logic for if there is no values or no jot with that id
            this.resFailure(res, 'No values for today, yet. Go back to bed!');
          } else {
            this.resFailure(res, 'No values for today, yet. Go back to bed!');
          }
        }
      })
      .catch((err) => {
        this.resFailure(res, err);
      });
  }

  @autobind
  public getFromDate(req:Request, res:Response, next: NextFunction): void {
    res.setHeader('Content-Type', 'application/json');
    const id:number = parseInt(req.params.id);
    const date:string = req.params.date;
    const num:number = parseInt(req.params.num);
    const start:string = req.query.start;
    const dateTime:number = (new Date(date)).getTime();
    
    this.firebase.database().ref('moments').orderByKey().startAt(start || dateTime.toString()).limitToFirst(num || 5).once('value')
      .then((snapshot) => {
        const {values, keys} = this.extractValues(snapshot, id);
        if (values.length) {
          const nextParam:string = this.getNextParam(req, values, num || 500, true);
          this.resSuccess(res, values, 'success', nextParam);
        } else {
          if (id) {
            // TODO: Need to make logic for if there is no values or no jot with that id
            this.resFailure(res, 'No Jot with that id found.');
          } else {
            this.resFailure(res, 'No values found for that date or after');
          }
        }
      })
      .catch((err) => {
        this.resFailure(res, err);
      });
  }

  @autobind
  public getLatest(req:Request, res:Response, next: NextFunction): void {
    res.setHeader('Content-Type', 'application/json');
    const id:number = parseInt(req.params.id);
    const num:number = parseInt(req.params.num);
    const start:string = req.query.start;

    let firebaseInstance;
    debugger;
    if (start) {
      firebaseInstance = this.firebase.database().ref('moments').orderByKey().endAt(start).limitToLast(num || 5);
    } else {
      firebaseInstance = this.firebase.database().ref('moments').orderByKey().limitToLast(num || 5);
    }
    firebaseInstance.once('value')
      .then((snapshot) => {
        const {values, keys} = this.extractValues(snapshot, id);
        if (values.length) {
          const nextParam:string = this.getNextParam(req, values, num || 5, false);
          this.resSuccess(res, values, 'success', nextParam);
        } else {
          if (id) {
            // TODO: Need to make logic for if there is no values or no jot with that id
            this.resFailure(res, 'No Jot with that id found.');
          } else {
            this.resFailure(res, 'Database error');
          }
        }
      })
      .catch((err) => {
        this.resFailure(res, err);
      });
  }

  init(): void {
    this.router.get('/jots', this.getJots);
    this.router.get('/jot/:id', this.getJots);

    this.router.get(['/jots/today/:num?', '/jot/:id/today/:num?'], this.getToday);
    this.router.get(['/jots/latest/:num?', '/jot/:id/latest/:num?'], this.getLatest);
    
    this.router.get(['/jots/from/:date/:num?', '/jot/:id/from/:date/:num?'], this.getFromDate);

  }
}

export default new JotRouter();