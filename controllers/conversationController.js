const { dbRun, dbGet, dbAll } = require("../helpers/dbHelpers");
const { parseId } = require("../helpers/parseHelpers");

async function createConversation(req, res, next) {
  try {
    const { user_id, title } = req.body;
    const userId = parseId(user_id);

    if (!userId) {
      return res.status(400).json({
        error: "valid user_id is required"
      });
    }

    const result = await dbRun(
      `INSERT INTO conversations (user_id, title) VALUES (?, ?)`,
      [userId, title || "New Chat"]
    );

    const conversation = await dbGet(
      `SELECT id, user_id, title, created_at FROM conversations WHERE id = ?`,
      [result.lastID]
    );

    res.status(201).json(conversation);
  } catch (error) {
    console.error("CREATE CONVERSATION ERROR:", error.message);
    next(error);
  }
}

async function getConversationsByUser(req, res, next) {
  try {
    const userId = parseId(req.params.user_id);

    if (!userId) {
      return res.status(400).json({
        error: "valid user_id is required"
      });
    }

    const rows = await dbAll(
      `
      SELECT id, user_id, title, created_at
      FROM conversations
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error.message);
    next(error);
  }
}

module.exports = { createConversation, getConversationsByUser };
