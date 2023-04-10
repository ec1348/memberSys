const app = require('../../app')
const db = require('../models')
const request = require('supertest')(app)
const expect = require('chai').expect

before( async () => {
  await db.sequelize.sync({force: true})
})

describe('Test memberController', function() {
  this.timeout(5000);
  describe('POST /signup', () => {
    it('Should add a new user', (done) => {
      request
        .post('/signup')
        .send({
          userName: 'testUserName',
          password: '123456',
          email: 'test@gmail.com',
          firstName: 'testFirstName',
          lastName: 'testLastName'
        })
        .end((err, res) => {
          console.log('123')
          expect(res.body.message).to.equal('add new member successfully')
          done()
        })
    });
    it('Should return userName has been used', (done) => {
      request
        .post('/signup')
        .send({
          userName: 'testUserName',
          password: '123456',
          email: 'testa@gmail.com',
          firstName: 'testFirstName',
          lastName: 'testLastName'
        })
        .end(( err, res) => {
          expect(res.body.message).to.equal('userName has been used')
          done(err)
        })
    });
    it('Should return email has been used', (done) => {
      request
        .post('/signup')
        .send({
          userName: 'testUserName2',
          password: '123456',
          email: 'test@gmail.com',
          firstName: 'testFirstName',
          lastName: 'testLastName'
        })
        .end(( err, res) => {
          expect(res.body.message).to.equal('email has been used')
          done(err)
        })
    });
  });
  describe('POST /signin', () => {
    it('Should login successfully', (done) => {
      request
        .post('/signin')
        .send({
          userName: 'testUserName',
          password: '123456',
        })
        .end((err, res) => {
          expect(res.body.message).to.equal('login successfully')
          done(err)
        })
    });
    it('should throw an error for invalid username or password', (done) => {
      request
        .post('/signin')
        .send({
          userName: 'wrongtestUserName',
          password: '123456',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('Invalid username or password')
          done(err)
        })
    });
  });
})