const express = require("express");
const {
  createStaff,
  getStaff,
  searchStaff
} = require("../controllers/staffController");

const router = express.Router();

router.post("/", createStaff);
router.get("/", getStaff);
router.post("/search", searchStaff);

module.exports = router;
