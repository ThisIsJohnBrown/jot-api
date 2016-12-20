import * as mocha from 'mocha';
import * as chai from 'chai';

import {Sensor, TemperatureSensor, NoiseSensor} from '../src/Sensor';

const expect = chai.expect;

let sensor:Sensor = new Sensor();
let temperatureSensor:TemperatureSensor = new TemperatureSensor();
let noiseSensor:NoiseSensor = new NoiseSensor();

describe('Sensor', () => {
  it('is an Object', () => {
    expect(sensor).to.be.an('Object');
  })
  it('type should be undefinied', () => {
    expect(sensor.type).to.equal(undefined);
  })
  sensor.setReading(5);
  it('should set reading to 5', () => {
    expect(sensor.getReading()).to.equal(5);
  })

  describe('Sensor types', () => {
    describe('TemperatureSensor', () => {
      it('type should be "temperature"', () => {
        expect(temperatureSensor.type).to.equal("temperature");
      })
    });

    describe('NoiseSensor', () => {
      it('type should be "noise"', () => {
        expect(noiseSensor.type).to.equal("noise");
      })
    });
  });
});