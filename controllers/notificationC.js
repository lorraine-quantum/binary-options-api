const Notification = require("../models/NotificationM");
const Withdrawal = require("../models/WithdrawalM");
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
let uniqueId = 0
const addNotification = async (req, res) => {
    try {
        if (req.body.amount * 1 !== req.body.amount) {
            throw new BadRequest('Amount has to be a number')
        }
        uniqueId++
        let day = new Date().getDate()
        let month = new Date().getMonth()
        let year = new Date().getFullYear()
        const date = `${day}-${month + 1}-${year}`
        req.body.owner = req.decoded.id;
        req.body.date = date;
        req.body.id = uuidv4();
        //add the amount Notificationed to the total Notifications field in the user schema
        req.body.reference = "#" + req.decoded.name.slice(0, 3) + "/" + uuidv4()
        const user = await User.findOne({ _id: req.decoded.id })
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" })
        }
        req.body.filterId = user.id
        req.body.filterName = user.name
        const newNotification = await Notification.create(req.body)
        const getPopulated = await Notification.findOne({ _id: newNotification._id }).populate({ path: "owner", model: "user" });
        res.status(StatusCodes.CREATED).json(getPopulated);
    } catch (error) {
        console.log(error.message);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const adminGetNotifications = async (req, res) => {
    try {
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.set('X-Total-Count', 10)
        res.set('Content-Range', 10)
        const queryId = JSON.parse(req.query.filter).userId
        let filter;
        if (queryId) {
            const filteredUser = await User.findOne({ id: queryId })
            const allNotifications = await Notification.find({ owner: filteredUser._id })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            if (allNotifications.length < 1) {
                throw new NotFound("No Notifications");
            }
            // console.log(res.Access-Control-Expose-Headers)

            res
                .status(StatusCodes.OK)
                .json(allNotifications);
            return
        }

        const allNotifications = await Notification.find({})
            .populate({ path: "owner", model: "user" })
            .sort({ createdAt: -1 })
        if (allNotifications.length < 1) {
            throw new NotFound("No Notifications");
        }
        res
            .status(StatusCodes.OK)
            .json(allNotifications);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};
const adminGetSingleNotification = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }

        const NotificationId = req.params.id
        const singleNotification = await Notification.findOne({
            id: NotificationId
        }).populate({ path: "owner", model: "user" });
        if (!singleNotification) {
            throw new NotFound(
                `no Notification with id ${NotificationId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleNotification);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const adminEditSingleNotification = async (req, res) => {
    try {

        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const NotificationId = Number(req.params.id)
        const singleNotification = await Notification.findOne({
            id: NotificationId
        }).populate({ path: "owner", model: "user" });
        if (!singleNotification) {
            throw new NotFound(
                `no Notification with id ${NotificationId}`
            );
        }
        const editedNotification = await Notification.findOneAndUpdate(
            { id: NotificationId },
            { title: req.body.title, message: req.body.message })
        return res.status(StatusCodes.ACCEPTED).json(editedNotification)
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}
const adminCreateNotification = async (req, res) => {
    try {
        let day = new Date().getDate()
        let month = new Date().getMonth()
        let year = new Date().getFullYear()
        const date = `${day}-${month + 1}-${year}`
        const singleUser = await User.findOne({
            name: req.body.owner.name
        })
        if (!singleUser) {
            throw new NotFound(
                `no User with name ${req.body.name}`
            );
        }
        const notification = await Notification.create({
            owner: singleUser._id,
            message: req.body.message,
            title: req.body.title,
            id: Date.now(),
            date
        })
        console.log(notification);
        res.status(StatusCodes.OK).json(notification);
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}

const adminDeleteSingleNotification = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const NotificationId = req.params.id
        const singleNotification = await Notification.findOneAndRemove({
            id: NotificationId
        });
        if (!singleNotification) {
            throw new NotFound(
                `no Notification with id ${NotificationId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json({ message: "Deleted" });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const getAllUserNotification = async (req, res) => {
    try {
        const userId = req.decoded.id

        const notifications = await Notification.find({ owner: userId })
        if (notifications.length < 1) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No Notifications" })
        }
        res.status(StatusCodes.OK).json(notifications)
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }

}
const getSingleUserNotification = async (req, res) => {
    try {
        const userId = req.decoded.id
        const notification = await Notification.findOne({ owner: userId, _id: req.params.id })
        if (!notification) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No Notifications" })
        }
        res.status(StatusCodes.OK).json(notification)
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }

}
const deleteSingleUserNotification = async (req, res) => {
    try {
        const userId = req.decoded.id
        const notification = await Notification.findOneAndRemove({ owner: userId, _id: req.params.id })
        if (!notification) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No Notification" })
        }
        res.status(StatusCodes.OK).json({ message: "deleted" })
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }

}
const editSingleUserNotification = async (req, res) => {
    try {
        const userId = req.decoded.id
        const notification = await Notification.findOneAndUpdate({ owner: userId, _id: req.params.id }, { readReceipt: true })
        if (!notification) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No Notification" })
        }
        res.status(StatusCodes.OK).json({ message: "Read receipt true" })
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }

}

module.exports = {
    addNotification,
    adminGetNotifications,
    adminGetSingleNotification,
    adminDeleteSingleNotification,
    adminCreateNotification,
    adminEditSingleNotification,
    getAllUserNotification,
    getSingleUserNotification,
    deleteSingleUserNotification,
    editSingleUserNotification
}