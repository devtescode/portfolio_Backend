const express = require('express')
const {userWelcome, register, login, check } = require('../Controllers/user.controllers')
const router = express.Router()


router.get("/user", userWelcome);
router.post("/register", register)
router.post("/login", login)
router.get("/check", check)

module.exports = router