const route = require("express").Router();
const {
    addNotification, adminGetNotifications, adminDeleteSingleNotification, adminEditSingleNotification, adminCreateNotification, adminGetSingleNotification
} = require("../controllers/notificationC");

route.post("/add", addNotification);
route.post("/", adminCreateNotification);
route.get("/:id", adminGetSingleNotification)

route.delete("/:id", adminDeleteSingleNotification);
route.put("/:id", adminEditSingleNotification);
route.get("/", adminGetNotifications);

module.exports = route;
