const memberController = require('./member.controller')
const app = require('../../app')
const request = require('supertest')(app)
const expect = require('chai').expect

describe('Test memberController', () => {
  describe('POST /signup', () => {
    it('Should add a new user', async () => {
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
        })
    })
  })
})