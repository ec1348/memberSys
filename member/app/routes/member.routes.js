module.exports = app => {
  const router = require('express').Router()
  const memberController = require("../controllers/member.controller");
  app.use("/", router)
  router.get("/members", memberController.queryMembers);
}