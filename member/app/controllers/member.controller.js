const db = require('../models')
const bcrypt = require('bcrypt')

let hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

exports.memberSignUp = async (req, res) => {
  let {
    userName,
    password,
    email,
    firstName,
    lastName
  } = req.body
  let hashedPassword = await hashPassword(password)

  // check userName
  await db.Member.findOne({where: {userName: userName}})
    .then(member => {
      if(member){
        res.send({
          message: 'userName has been used'
        })
      }
    })
    .catch(err => {
      console.log('err')
    })

  // check email
  await db.Member.findOne({where: {email: email}})
    .then(member => {
      if(member){
        res.send({
          message: 'email has been used'
        })
      }
    })
  
  
  db.Member.create({
    userName: userName,
    password: hashedPassword,
    email: email,
    firstName: firstName,
    lastName: lastName
  })
    .then(member => {
      res.send({
        message: 'add new member successfully',
        newMember: member
      })
  })
    .catch(err => {
      res.err(err)
  })
};