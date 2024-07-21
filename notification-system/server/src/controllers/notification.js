const NotificationModel = require("../models/notificationModel");

const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.decode.userId;
    const notificationObj = new NotificationModel({ message, userId });
    const createdNotification = await notificationObj.save();
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
      read: false,
    }).populate("userId");
    return res.status(200).json(fetchedNotifications);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const updateNotification = await NotificationModel.updateOne(
      {_id: notificationId},
      { read: true },
      { new: true }
    );
    return res.status(204).json(updateNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
};
