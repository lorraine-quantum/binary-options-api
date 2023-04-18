const route = require("express").Router();
const { editUser, deleteUser, editNotification } = require('../controllers/modifyUserC')
const { getAllUserNotification,
    getSingleUserNotification,
    deleteSingleUserNotification,
    editSingleUserNotification } = require('../controllers/notificationC')
route.put('/edit-user', editUser)
route.delete('/delete-user/:id', deleteUser)
route.get('/all-notifications', getAllUserNotification)
route.get('/get-notification/:id', getSingleUserNotification)
route.delete('/delete-notification/:id', deleteSingleUserNotification)
route.patch('/read-notification/:id', editSingleUserNotification)
module.exports = route