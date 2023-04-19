const route = require("express").Router();
const { getUsers, adminGetSingleUser, adminEditSingleUser } = require('../controllers/admin')
const {
  adddeposit, adminDeleteSingleUser, adminGetdeposits, adminDeleteSingledeposit, adminGetSingledeposit, getSingledeposit, adminEditSingledeposit
} = require("../controllers/deposit");
const {
  addWithdrawal, adminGetWithdrawals, adminDeleteSingleWithdrawal, adminGetSingleWithdrawal, adminEditSingleWithdrawal
} = require("../controllers/withdrawal");

//admin can manipulate users and deposits details
route.post("/add", adddeposit);
route.get("/single/:id", getSingledeposit);
route.get("/deposits", adminGetdeposits);
route.get("/deposits/:id", adminGetSingledeposit);
route.put("/deposits/:id", adminEditSingledeposit);
route.delete("/users/:id", adminDeleteSingleUser);
route.delete("/deposits/:id", adminDeleteSingledeposit);

// route.post("admin/withdrawal/add", adddeposit);
// route.get("/single/:id", getSingledeposit);
route.get("/withdrawals", adminGetWithdrawals);
route.get("/withdrawals/:id", adminGetSingleWithdrawal);
route.put("/withdrawals/:id", adminEditSingleWithdrawal);
route.delete("/withdrawals/:id", adminDeleteSingleWithdrawal);


route.get('/users', getUsers)
route.get('/users/:id', adminGetSingleUser)
route.put('/users/:id', adminEditSingleUser)

module.exports = route