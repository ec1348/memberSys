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
  
  let [memberWithUserName, memberWithEmail] = await Promise.all([
    db.Member.findOne({where: {userName: userName}}),
    db.Member.findOne({where: {email: email}})
  ]);
  
  if (memberWithUserName) {
    res.send({
      message: 'userName has been used'
    })
    return;
  }
  
  if (memberWithEmail) {
    res.send({
      message: 'email has been used'
    })
    return;
  }
  
  
  await db.Member.create({
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
      console.log(err)
      res.status(400).json({message: 'Error creating user'})
  })
};