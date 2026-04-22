const express = require("express");

const rootRoutes = require("./rootRoutes");
const userRoutes = require("./userRoutes");
const conversationRoutes = require("./conversationRoutes");
const messageRoutes = require("./messageRoutes");
const staffRoutes = require("./staffRoutes");
const clientRoutes = require("./clientRoutes");
const chatRoutes = require("./chatRoutes");
const toolRoutes = require("./toolRoutes");

// ✅ NEW
const v2Routes = require("./v2");

const router = express.Router();

router.use("/", rootRoutes);
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/staff", staffRoutes);
router.use("/clients", clientRoutes);
router.use("/chat", chatRoutes);
router.use("/", toolRoutes);

// ✅ NEW
router.use("/v2", v2Routes);

module.exports = router;