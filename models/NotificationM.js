const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const NotificationSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: [true, "please provide date"],
        },
        readReceipt: {
            type: Boolean,
            default: false,
        },
        id: {
            type: String,
            required: [true, "Id cannot be empty"]
        },
        title: {
            type: String,
            required: [true, "please provide title"],
        },
        message: {
            type: String,
            required: [true, "please provide message"],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "please provide owner"],
        }

    },
    { timestamps: true },

);
// NotificationSchema.plugin(AutoIncrement,{inc_field:'id'})
module.exports = mongoose.model("Notifications", NotificationSchema);
