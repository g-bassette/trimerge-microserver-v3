const { dbRun, dbGet, dbAll } = require("../helpers/dbHelpers");
const { parseId } = require("../helpers/parseHelpers");

async function createMessage(req, res, next) {
  try {
    const { conversation_id, role, content } = req.body;
    const conversationId = parseId(conversation_id);

    if (!conversationId || !role || !content) {
      return res.status(400).json({
        error: "conversation_id, role, and content are required"
      });
    }

    const result = await dbRun(
      `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
      [conversationId, role, content]
    );

    const messageRow = await dbGet(
      `
      SELECT id, conversation_id, role, content, created_at
      FROM messages
      WHERE id = ?
      `,
      [result.lastID]
    );

    res.status(201).json(messageRow);
  } catch (error) {
    console.error("CREATE MESSAGE ERROR:", error.message);
    next(error);
  }
}

async function getMessagesByConversation(req, res, next) {
  try {
    const conversationId = parseId(req.params.conversation_id);

    if (!conversationId) {
      return res.status(400).json({
        error: "valid conversation_id is required"
      });
    }

    const rows = await dbAll(
      `
      SELECT id, conversation_id, role, content, created_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC, id ASC
      `,
      [conversationId]
    );

    res.json(rows);
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error.message);
    next(error);
  }
}

module.exports = { createMessage, getMessagesByConversation };
