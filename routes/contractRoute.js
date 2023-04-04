const route = require("express").Router();
const {
  addContract,
  getContracts,
  getSingleContract,
  deleteAllContracts,
  deleteContract,
  editContract,
} = require("../controllers/contractController");

route.get("/", getContracts);
route.post("/add", addContract);
route
  .patch("/edit/:id", editContract)
  .get("/:id", getSingleContract)
  .delete("/delete/:id", deleteContract);

module.exports = route;
