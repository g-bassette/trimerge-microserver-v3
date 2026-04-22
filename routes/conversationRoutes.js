const express = require("express");
const {
  createConversation,
  getConversationsByUser
} = require("../controllers/conversationController");

const router = express.Router();

router.post("/", createConversation);
router.get("/:user_id", getConversationsByUser);

module.exports = router;
