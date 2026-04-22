const { dbRun, dbGet, dbAll } = require("../helpers/dbHelpers");

async function createUser(req, res, next) {
  try {
    const { username } = req.body;

    if (!username || !String(username).trim()) {
      return res.status(400).json({
        error: "username is required"
      });
    }

    const result = await dbRun(
      `INSERT INTO users (username) VALUES (?)`,
      [String(username).trim()]
    );

    const user = await dbGet(
      `SELECT id, username, created_at FROM users WHERE id = ?`,
      [result.lastID]
    );

    res.status(201).json(user);
  } catch (error) {
    console.error("CREATE USER ERROR:", error.message);
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const rows = await dbAll(
      `SELECT id, username, created_at FROM users ORDER BY id DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("GET USERS ERROR:", error.message);
    next(error);
  }
}

module.exports = { createUser, getUsers };
