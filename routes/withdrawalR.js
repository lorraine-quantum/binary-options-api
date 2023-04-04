const route = require("express").Router();
const {
    addWithdrawal, getWithdrawals, getSingleWithdrawal
} = require("../controllers/withdrawal");

route.post("/add", addWithdrawal);
route.get("/single/:id", getSingleWithdrawal);
route.get("/all", getWithdrawals);

module.exports = route;
