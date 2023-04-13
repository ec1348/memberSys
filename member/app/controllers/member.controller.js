const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
    lastName: lastName,
    permission_id: 1, //default permission is USER, id = 1
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

exports.memberSignIn = async (req, res) => {
  try{
    const {userName, password} = req.body
    // Check if username exists in the member table
    const member = await db.Member.findOne({ where: { userName } });
    if (!member) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Compare hashed password with the provided password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if token has revoked = 0
    const hasValidToken = await db.JwtTokens.findAll( { 
      where: {
        revoked: false,
        member_id: member.id
      } 
    })
    if(hasValidToken.length > 0){
      await db.JwtTokens.update({ revoked: true }, {
        where: { member_id : member.id}
      })
    }

     // Create a JWT token
     const payload = {
      member_id: member.id,
      username: member.username
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const currentDate = new Date();
    const oneHourLater = new Date(currentDate.setHours(currentDate.getHours() + 1))
    // Save login history
    const loginHistory = {
      member_id: member.id,
      ip_address: req.ip,
      device_info: req.headers['user-agent'],
      login_at: new Date()
    };

    await db.LoginHistory.create(loginHistory);

    //Save token history
    const tokenHistory = {
      member_id: member.id,
      token: token,
      expired_at: oneHourLater
    }
    await db.JwtTokens.create(tokenHistory)
    
    // Return the JWT token
    res.json(
      {
        message: 'login successfully',
        token: token
      }
    )
  } catch {
    res.status(500).json({ error: 'Server error'})
  }
}

exports.memberLogout = async (req, res) => {
  try{
    let { token: authToken } = req
    // Check if token exists in the JwtTokens table
    const token = await db.JwtTokens.findOne({ where: { token: authToken }});
    if(!token) {
      return res.status(404).json({ message: 'Invalid token' });
    }
    await db.JwtTokens.update({ revoked: true }, { where: { token: authToken }})
    res.json({ message: 'Logout successfully'})
  } catch {
    res.status(500).json({ error: 'Server error'})
  }
}

exports.getAllMembers = async (req, res) => {
  // Only role ['admin', 'moderator'] can access this resource
  try {
    const { role } = req
    if(role !== 'admin' && role !== 'moderator') {
      return res.status(403).json({
        message: 'Forbidden: You do not authorized to access this resource.'
      })
    }
    const members = await db.Member.findAll({ include: [{ model: db.Permission, attributes: ['name'] }]})
    if( members ){
      return res.send(
        {
          message: 'get all members',
          All_members: members
        }
      )
    }
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}