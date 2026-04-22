const express = require("express");
const {
  createMessage,
  getMessagesByConversation
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.get("/:conversation_id", getMessagesByConversation);

module.exports = router;
