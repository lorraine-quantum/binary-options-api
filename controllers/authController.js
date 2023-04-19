require("dotenv").config();
const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const { shuffle, seedArray } = require('../utils/seed-phrase')
const generator = require('generate-serial-number')
const serialNumber = generator.generate(1)

const {
  BadRequest,
  NotFound,
  Unauthenticated,
} = require("../errors/customErrors");
const NotificationM = require("../models/NotificationM");
const register = async (req, res) => {
  try {
    shuffle(seedArray)
    let slicedArray = seedArray.slice(0, 12)
    let seedPhrase = slicedArray.join("-")
    req.body.seedPhrase = seedPhrase
    const firstName = req.body.name.substring(0, req.body.name.indexOf(' '))
    req.body.notification = [{ title: "Welcome", message: "" }]
    req.body.id = serialNumber
    const newUser = await User.create(req.body);
    const fetchUser = await User.findOne({ email: req.body.email })
    //default notification
    let day = new Date().getDate()
    let month = new Date().getMonth()
    let year = new Date().getFullYear()
    const date = `${day}-${month + 1}-${year}`
    const capitalizeName = (name) => {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    await NotificationM.create({ owner: fetchUser._id, date, id: Date.now(), title: "Welcome", message: `Hi ${capitalizeName(firstName)}, Welcome to the Next Generation trading system.` })
    const token = newUser.generateJWT(process.env.JWT_SECRET);
    res
      .status(StatusCodes.CREATED)
      .json({ token, owner: newUser.name, email: newUser.email });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email already registered, Sign In" });
      return;
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    //Remove user if there's a non-409 error during registration
    await User.findOneAndDelete({ email: req.body.email })
    console.log(StatusCodes.BAD_REQUEST, error.message);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequest("email and password cannot be empty");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new NotFound("Email not registered, Sign up");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Unauthenticated("Invalid credentials");
    }
    const token = user.generateJWT(process.env.JWT_SECRET);
    res.status(StatusCodes.OK).json({ user, token: token });
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
