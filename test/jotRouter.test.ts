import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('JotRouter', function() {
  describe.skip('Can connect to Firebase', function() {
    this.timeout(0);
    it('responds with connection message', () => {
      return chai.request(app).get('/api/v1/jots')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
        })
    })
  });

  describe.skip('GET api/v1/jots', function() {
    it('responds with JSON', () => {
      return chai.request(app).get('/api/v1/jots')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
        })
    })

    it('has all keys', () => {
      return chai.request(app).get('/api/v1/jots')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys([
            'message',
            'values',
            'next'
          ]);
        })
    })
  })

  describe('GET api/v1/jots/:id', function() {
    it.skip('responds with JSON', () => {
      return chai.request(app).get('/api/v1/jot/1')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
        })
    })

    it('should return 404', () => {
      return chai.request(app).get('/api/v1/jot/1337')
        .then(res => {
          expect(res.status).is.equal(404);
        })
    })
  })
});

//   it('should include Wolverine', () => {
//     return chai.request(app).get('/api/v1/heroes')
//       .then(res => {
//         let Wolverine = res.body.find(hero => hero.name === 'Wolverine');
//         expect(Wolverine).to.exist;
//         expect(Wolverine).to.have.all.keys([
//           'id',
//           'name',
//           'aliases',
//           'occupation',
//           'gender',
//           'height',
//           'hair',
//           'eyes',
//           'powers'
//         ])
//       })
//   })
// }) 

// describe('GET api/v1/heroes/:id', () => {
//   it('responds with single JSON object', () => {
//     return chai.request(app).get('/api/v1/heroes/1')
//       .then(res=> {
//         expect(res.status).is.equal(200);
//         expect(res).to.be.json;
//         expect(res.body).to.be.an('object');
//       })
//   })

//   it('responds with Luke Cage', () => {
//     return chai.request(app).get('/api/v1/heroes/1')
//       .then(res => {
//         expect(res.status).is.equal(200);
//         expect(res.body.hero.name).to.equal('Luke Cage');
//       })
//   })

//   it('responds with 404', () => {
//     return chai.request(app).get('/api/v1/heroes/foo')
//       .catch(res => {
//         expect(res.status).is.equal(404);
//       })
//   })
// })