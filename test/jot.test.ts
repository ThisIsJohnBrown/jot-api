import * as mocha from 'mocha';
import * as chai from 'chai';

import Jot from '../src/Jot';

const expect = chai.expect;

let jot:Jot = new Jot('elkhead', ['temperature', 'noise']);

describe('Jot', () => {
  it('is an Object', () => {
    expect(jot).to.be.an('Object');
  })
  it('has name "elkhead"', () => {
    expect(jot.name).to.be.a('string');
    expect(jot.name).to.equal('elkhead');
  })

  describe('Jot sensor information', () => {
    it('has two sensors', () => {
      expect(jot.sensors).to.be.an('Array');
      expect(jot.sensors.length).to.equal(2);
    })

    it('has TemperatureSensor and NoisesSensor', () => {
      expect(jot.sensors[0]).to.be.an('Object');
      expect(jot.sensors[0].type).to.equal('temperature');

      expect(jot.sensors[1]).to.be.an('Object');
      expect(jot.sensors[1].type).to.equal('noise');
    })
  });
});