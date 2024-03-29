var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();

// Populate default services
client.hset('services', 'svc0', 'up');
client.hset('services', 'svc1', 'down');


describe('Requests to the /svcmgt path', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/svcmgt')
      .expect(200, done);
  });
  it('Returns a JSON format', function(done) {
    request(app)
      .get('/svcmgt')
      .expect('Content-Type', /json/, done);
  });
  it('Returns content with svc0, and svc1', function(done) {
    request(app).get('/svcmgt').expect(/svc0/i).expect(/svc1/i, done);
    });
  it('Can post new service', function(done) {
      request(app).post('/svcmgt').send('svcname=svc2&state=down').expect(201, done);
    });
  it('Can post new service, then retreive it', function(done) {
    request(app).post('/svcmgt').send('svcname=svc3&state=up').expect(201, function(){
      request(app).get('/svcmgt').expect(/svc3/i,done);
    });
  });
});

describe('Requests to the /svcmgt/about path', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/svcmgt/about')
      .expect(200, done);
  });
  it('Returns a about content', function(done) {
    request(app)
      .get('/svcmgt/about')
      .expect(/about/i, done);
  });
});

describe('Requests to the /svcmgt/:svcname path', function() {
  it('get existing service must return status 200', function(done) {
    request(app).get('/svcmgt/svc3').expect(200, done);
  });
  it('get existing service must return correct body', function(done) {
    request(app).get('/svcmgt/svc3').expect(/svc3 state:up/i, done);
  });
  it('delete existing service must return status 204', function(done) {
    request(app).delete('/svcmgt/svc3').expect(204, done);
  });
  it('delete unexistant service must return status 404', function(done) {
      request(app).delete('/svcmgt/service-not-defined').expect(404, done);
  });
  it('get unexistant service must return status 404', function(done) {
      request(app).get('/svcmgt/service-not-defined').expect(404, done);
  });
});
