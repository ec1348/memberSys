module.exports = app => {
  const router = require('express').Router()
  const memberController = require("../controllers/member.controller");
  const jwt_verify = require("../middleware/jwt-verify")
  const permission_check = require("../middleware/permission-check")
  app.use("/", router)
  router.post("/signup", memberController.memberSignUp)
  router.post("/signIn", memberController.memberSignIn)
  router.post("/logout", jwt_verify, memberController.memberLogout)
  router.get("/members", jwt_verify, permission_check, memberController.getAllMembers)
}