const route = require("express").Router();
const {
  adddeposit, getdeposits, getUser, getSingledeposit
} = require("../controllers/deposit");

route.post("/add", adddeposit);
route.get("/token-user", getUser);
route.get("/single/:id", getSingledeposit);
route.get("/all", getdeposits);

module.exports = route;
