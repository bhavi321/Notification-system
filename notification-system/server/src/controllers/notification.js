const NotificationModel = require("../models/notificationModel");
const { getIo, connectedUsers } = require("./realtime");

const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.decode.userId;
    const notificationObj = new NotificationModel({ message, userId });
    const createdNotification = await notificationObj.save();

    // const io = getIo();
    // let id;

    // console.log(connectedUsers, id);

    // io.to([...connectedUsers].filter((ele) => ele != id)).emit(
    //   "broadcastNotification",
    //   message,
    //   {
    //     except: id,
    //   }
    // ); // Use socket.id from the request
    // if (io) {
    //   io.sockets.emit("broadcastNotification", message);
    //   console.log("Message sent to clients:", message);
    // }
    return res.status(201).send({ status: true, data: createdNotification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const fetchedNotifications = await NotificationModel.find({
      userId: { $ne: userId },
    }).populate('userId');
    return res.status(200).json(fetchedNotifications);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

module.exports = { createNotification, getNotifications };
