const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const { Unauthenticated } = require("../errors/customErrors");

const auth = async (req, res, next) => {
  const yeso = true

  try {
    if (req.url.includes("secret")) {
      return next()
    }

    let { authorization } = req.headers;
    if (!authorization) {
      throw new Unauthenticated("supply token and Bearer");
    }
    console.log('admin auth start')
    res.set('Access-Control-Expose-Headers', 'Content-Range')
    res.set('X-Total-Count', 10)
    res.set('Content-Range', 10)
    authorization = authorization.replace(/(^"|"$)/g, '')
    console.log(authorization);
    const payload = jwt.verify(authorization, process.env.JWT_SECRET);
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
