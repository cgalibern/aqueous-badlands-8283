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
  it('Returns content with svcone', function(done) {
    request(app)
      .get('/svcmgt')
      .expect(/svcone/i, done);
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
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/svcmgt/13')
      .expect(200, done);
  });
  it('Returns correct service id content', function(done) {
    request(app)
      .get('/svcmgt/12')
      .expect(/service id 12/i, done);
  });
});
