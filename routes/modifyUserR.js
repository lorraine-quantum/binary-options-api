const route = require("express").Router();
const { editUser, deleteUser, editNotification } = require('../controllers/modifyUserC')

route.put('/edit-user', editUser)
route.delete('/delete-user/:id', deleteUser)
route.patch('/push-notification', editNotification)
module.exports = route