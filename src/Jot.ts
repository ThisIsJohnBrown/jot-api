import * as winston from 'winston';
import {Sensor, TemperatureSensor, NoiseSensor} from './Sensor';

export class Jot {
  protected lastHeard: number;
  public sensors:Array<Sensor> = [];

  constructor(public name:string, sensorNames:Array<string>) {
    const types = {
      'temperature': new TemperatureSensor,
      'noise': new NoiseSensor
    }
    for (let i in sensorNames) {
      this.sensors.push(types[sensorNames[i]]);
    }
  }
}

export default Jot;