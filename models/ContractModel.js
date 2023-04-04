const mongoose = require("mongoose");
const ContractSchema = new mongoose.Schema(
  {
    contract: {
      type: String,
      required: [true, "please provide contract name"],
    },
    company: {
      type: String,
      required: [true, "please provide company name"],
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "please provide owner"],
    },
  },
  { timeStamps: true }
);
module.exports = mongoose.model("Contracts", ContractSchema);
