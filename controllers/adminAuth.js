require("dotenv").config();
const Admin = require("../models/AdminAuth");
const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const {
  BadRequest,
  NotFound,
  Unauthenticated,
} = require("../errors/customErrors");
const register = async (req, res) => {
  try {
    console.log('registering...')
    const newUser = await Admin.create(req.body);
    const token = newUser.generateJWT(process.env.JWT_SECRET);
    res
      .status(StatusCodes.CREATED)
      .json({ user: token });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Username already registered, Sign In" });
      return;
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(StatusCodes.BAD_REQUEST, error.message);
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new BadRequest("username and password cannot be empty");
    }
    const user = await Admin.findOne({ username: username });
    if (!user) {
      throw new NotFound("Username not registered, Sign up");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Unauthenticated("Invalid credentials");
    }
    const token = user.generateJWT(process.env.JWT_SECRET);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.cookie('token', 'dax', {
      // maxAge: 5000,
      secure: true,
      httpOnly: false,
      sameSite: 'lax'
    });


    // console.log(res.cookie().token)
    res.status(StatusCodes.OK).json(token);
  } catch (error) {
    const { message, statusCode } = error;
    console.log(statusCode, message);
    if (statusCode) {
      res.status(statusCode).json({ message: message });
      console.log(statusCode, message);
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: message });
    console.log(message);
  }
};

module.exports = { register, login };
