const memberController = require('./member.controller')
const app = require('../../app')
const request = require('supertest')(app)
const expect = require('chai').expect

describe('Test memberController', () => {
  describe('POST /signup', async () => {
    it('Should add a new user', (done) => {
      request
        .post('/signup')
        .send({
          userName: 'testUserName',
          password: '6666',
          email: 'test@gmail.com',
          firstName: 'testFirstName',
          lastName: 'testLastName'
        })
        .end(( err, res) => {
          expect(res.body.message).to.equal('add new member successfully')
          done(err)
        })
    })
    it('Should return userName has been used', (done) => {
      request
        .post('/signup')
        .send({
          userName: 'testUserName',
          password: '6666',
          email: 'testa@gmail.com',
          firstName: 'testFirstName',
          lastName: 'testLastName'
        })
        .end(( err, res) => {
          expect(res.body.message).to.equal('userName has been used')
          done(err)
        })
    })
  })
})