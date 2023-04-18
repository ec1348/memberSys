const app = require('../../app')
const db = require('../models')
const seed = require('../models/seed')
const request = require('supertest')(app)
const expect = require('chai').expect
const bcrypt = require('bcrypt')
const uuid = require('uuid')

before( async () => {
  await db.sequelize.sync({force: true})
  seed(db)
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
  describe('GET /members', () => {
    it('Should return a list of members when authenticated with a valid token', (done) => {
      let token = ''
      request
        .post('/signin')
        .send({ userName: 'admin', password: '123456'})
        .end(( err, res) => {
          token = res.body.token
          request
            .get('/members')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              expect(res.body.message).to.equal('get all members')
              done(err)
            })
        })
    });
    it('should return a 401 Unauthorized response', (done) => {
      request
        .get('/members')
        .set('Authorization', `Bearer asf`)
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.body.message).to.equal('Unauthorized: Failed to authenticate token')
          done(err)
        })
    });
    it('should return a 403 Forbidden error when authenticated with a valid token but without appropriate permissions', (done) => {
      let token = ''
      request
        .post('/signin')
        .send({ userName: 'user', password: '123456'})
        .end(( err, res) => {
          token = res.body.token
          request
            .get('/members')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              expect(res.status).to.equal(403)
              expect(res.body.message).to.equal('Forbidden: You do not authorized to access this resource.')
              done(err)
            })
        })
    });
  });
  describe('POST /logout', () => {
    it('Should return a logout successfully message', (done) => {
      let token = ''
      request
        .post('/signin')
        .send({ userName: 'admin', password: '123456'})
        .end(( err, res) => {
          token = res.body.token
          request
            .post('/logout')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              expect(res.body.message).to.equal('Logout successfully')
              done(err)
            })
        })
    });
    it('should return a 401 Unauthorized response', (done) => {
      request
        .post('/logout')
        .set('Authorization', `Bearer asf`)
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.body.message).to.equal('Unauthorized: Failed to authenticate token')
          done(err)
        })
    });
  });
  describe('POST /request-reset-password', () => {
    it('should send a password reset email for valid user credentials', async () => {
      const res = await request
        .post('/request-reset-password')
        .send({ userName: 'user', email: 'ec1111@gmail.com' })
        .expect(200);
      expect(res.body.message).to.equal('Password reset email sent');
      expect(res.body.resetLink).to.be.a('string');
      const member_id = res.body.resetLink.split('&member_id=')[1]
      const revokedRequest = await db.PasswordResetRequest.findOne({ where:{member_id, revoked: false} })
      revokedRequest.destroy();
    });

    it('should return 401 for invalid user credentials', async () => {
      const res = await request
        .post('/request-reset-password')
        .send({ userName: 'nonexistentuser', email: 'nonexistentuser@example.com' })
        .expect(401);
      expect(res.body.message).to.equal('Invalid username or password.');
    });
  });
  describe('PUT /reset-password', () => {
    let resetToken = uuid.v4(), memberId;
    beforeEach(async () => {
      const member = await db.Member.findOne({ where: { userName: 'user' } });
      const timestamp = Date.now()
      const key = `${resetToken}:${member.id}:${timestamp}`
      await db.PasswordResetRequest.create({
        member_id: member.id,
        token: await bcrypt.hash(key, 10),
        timestamp,
        revoked: false,
      });
      memberId = member.id;
    });

    it('should update password for valid reset token and member ID', async () => {
      const res = await request
        .put(`/reset-password?token=${resetToken}&member_id=${memberId}`)
        .send({ password: 'newPassword123' })
        .expect(200);
      expect(res.body.message).to.equal('Update password successfully');
    });

    it('should return 401 for invalid reset token or member ID(Invalid Token)', async () => {
      const res = await request
        .put(`/reset-password?token=invalidToken&member_id=${memberId}`)
        .send({ password: 'newPassword123' })
        .expect(401)
      expect(res.body.message).to.equal('Unauthorized operation');
    });

    it('should return 401 for invalid reset token or member ID(Invalid memberID)', async () => {
      const res2 = await request
        .put(`/reset-password?token=${resetToken}&member_id=999`)
        .send({ password: 'newPassword123' })
        .expect(401)
      expect(res2.body.message).to.equal('Unauthorized operation');
    });

    it('should return 401 for expired reset token', async () => {
      const resetRequest = await db.PasswordResetRequest.findOne({ where: { member_id: memberId, revoked: false } });
      resetRequest.timestamp = Date.now() - 11 * 60 * 1000;
      await resetRequest.save();
      const res = await request
        .put(`/reset-password?token=${resetToken}&member_id=${memberId}`)
        .send({ password: 'newPassword123' })
        .expect(401);
      expect(res.body.message).to.equal('Token expired!');
    });
  });
})