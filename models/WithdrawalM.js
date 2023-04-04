const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const WithdrawalSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: [true, "please provide transaction date"],
        },
        id: {
            type: String,
            required: [true, "transaction id cannot be empty"]
        },
        reference: {
            type: String,
            required: [true, "please provide reference"],
        },
        amount: {
            type: Number,
            required: [true, "please provide amount"],
        },
        edited: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["pending", "failed", "approved"],
            default: "pending",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "please provide owner"],
        },
        filterId: {
            type: Number,
            required: true,
        },
        filterName: {
            type: String,
            required: true,
        }

    },
    { timestamps: true },

);
// WithdrawalSchema.plugin(AutoIncrement,{inc_field:'id'})
module.exports = mongoose.model("Withdrawals", WithdrawalSchema);
