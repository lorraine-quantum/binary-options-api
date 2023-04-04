const route = require("express").Router();
const {
  addTransaction, getTransactions, getUser, getSingleTransaction
} = require("../controllers/transaction");

route.post("/add", addTransaction);
route.get("/token-user", getUser);
route.get("/single/:id", getSingleTransaction);
route.get("/all", getTransactions);

module.exports = route;
