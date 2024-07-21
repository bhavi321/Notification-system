const express = require("express");
const { registerUser } = require("../controllers/user");
const { createNotification, getNotifications, markNotificationAsRead } = require("../controllers/notification");
const authService = require("../controllers/user");
const { login } = require("../controllers/user");
const { authenticate } = require("../middlewares/authentication");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/notifications", authenticate, createNotification);
router.get("/notifications", authenticate, getNotifications);
router.put("/notifications/:id", authenticate, markNotificationAsRead)

module.exports = router;
