var request = require('supertest');
var app = require('./app');

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
      request(app).post('/svcmgt').send('svcname=svc2').expect(201, done);
    });
  it('Can post new service, then retreive it', function(done) {
    request(app).post('/svcmgt').send('svcname=svc3').expect(201, function(){
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

describe('Requests to the /svcmgt/:id path', function() {
  it('Returns a 200 status code on existing service 3', function(done) {
    request(app).get('/svcmgt/3').expect(200, done);
  });
  it('Returns correct service 3 name content', function(done) {
    request(app).get('/svcmgt/3').expect(/svc3/i, done);
  });
  it('service id 3: Delete must 204', function(done) {
    request(app).delete('/svcmgt/3').expect(204, function() {
      request(app).get('/svcmgt/3').expect(404, done);
    });
  });
});
