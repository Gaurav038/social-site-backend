const express = require("express");
const { register, login, logOut } = require("../controllers/auth");
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logOut', logOut)

module.exports = router