// This middlware will handle jwt expiration check and revoked token check
const jwt = require('jsonwebtoken')
const db = require('../models')
module.exports = (req, res, next) => {
  let token = req.headers["authorization"];
  token = token.split(' ')[1];
  if(!token){
    return res.status(401).json({ message: 'No token provided!' });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if( err ){
      return res.status(401).json({
        message: 'Unauthorized: Failed to authenticate token'
      });
    }
    const tokenIsValid = await db.JwtTokens.findOne({
      where: {
        token: token,
        revoked: false
      }
    })
    if( !tokenIsValid ) {
      return res.status(401).json({
        message: 'Unauthorized: Failed to authenticate token'
      });
    }
    req.member_id = decoded.member_id;
    req.token = token
    next()
  })
}