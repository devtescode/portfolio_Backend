const express = require('express')
const {userWelcome, register, login, check, contact } = require('../Controllers/user.controllers')
const router = express.Router()


router.get("/user", userWelcome);
router.post("/register", register)
router.post("/login", login)
router.get("/check", check)
router.post("/contact", contact)

module.exports = router