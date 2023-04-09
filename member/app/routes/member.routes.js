module.exports = app => {
  const router = require('express').Router()
  const memberController = require("../controllers/member.controller");
  app.use("/", router)
  router.post("/signup", memberController.memberSignUp)
  router.post("/signIn", memberController.memberSignIn)
}