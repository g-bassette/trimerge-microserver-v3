const express = require("express");
const {
  routeMessage,
  executeParsedTool
} = require("../controllers/toolController");

const router = express.Router();

router.post("/route-message", routeMessage);
router.post("/execute-tool", executeParsedTool);

module.exports = router;
