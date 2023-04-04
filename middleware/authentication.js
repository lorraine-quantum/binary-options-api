const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const { Unauthenticated } = require("../errors/customErrors");

const auth = async (req, res, next) => {
  try {
    console.log('auth start')
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      throw new Unauthenticated("supply token and Bearer");
    }
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = { name: payload.name, id: payload.id };
    console.log('auth end, next')
    next();

  } catch (error) {
    console.log('auth error')
    const { message, statusCode } = error;
    console.log(statusCode, message);
    if (statusCode) {
      res.status(statusCode).json({ message });
      console.log(statusCode, message);
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message });
    console.log(message);
  }
};

module.exports = auth;
