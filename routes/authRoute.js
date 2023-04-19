const express = require("express");
const route = express.Router();
const { login, register } = require("../controllers/authController");
const { editPassword } = require('../controllers/modifyUserC')
route.post("/login", login);
route.post("/register", register);
// route.put('/edit-password',editPassword)
module.exports = route;
