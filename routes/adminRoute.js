const route = require("express").Router();
const { getUsers, adminGetSingleUser, adminEditSingleUser } = require('../controllers/admin')
const {
  addTransaction, adminDeleteSingleUser, adminGetTransactions, adminDeleteSingleTransaction, adminGetSingleTransaction, getSingleTransaction, adminEditSingleTransaction
} = require("../controllers/transaction");
const {
  addWithdrawal, adminGetWithdrawals, adminDeleteSingleWithdrawal, adminGetSingleWithdrawal, adminEditSingleWithdrawal
} = require("../controllers/withdrawal");

//admin can manipulate users and transactions details
route.post("/add", addTransaction);
route.get("/single/:id", getSingleTransaction);
route.get("/transactions", adminGetTransactions);
route.get("/transactions/:id", adminGetSingleTransaction);
route.put("/transactions/:id", adminEditSingleTransaction);
route.delete("/users/:id", adminDeleteSingleUser);
route.delete("/transactions/:id", adminDeleteSingleTransaction);

// route.post("admin/withdrawal/add", addTransaction);
// route.get("/single/:id", getSingleTransaction);
route.get("/withdrawals", adminGetWithdrawals);
route.get("/withdrawals/:id", adminGetSingleWithdrawal);
route.put("/withdrawals/:id", adminEditSingleWithdrawal);
route.delete("/withdrawals/:id", adminDeleteSingleWithdrawal);


route.get('/users', getUsers)
route.get('/users/:id', adminGetSingleUser)
route.put('/users/:id', adminEditSingleUser)

module.exports = route