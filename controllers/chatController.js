const { OLLAMA_MODEL, ROUTER_MODEL } = require("../config");
const { dbRun, dbGet } = require("../helpers/dbHelpers");
const { parseId } = require("../helpers/parseHelpers");
const { routeMessageWithModel } = require("../services/routerService");
const { executeTool } = require("../services/toolService");
const { formatToolResultWithModel } = require("../services/formatterService");

async function chat(req, res, next) {
  try {
    const { model, message, conversation_id } = req.body;
    const conversationId = parseId(conversation_id);

    if (!message) {
      return res.status(400).json({
        error: "message is required"
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        error: "valid conversation_id is required"
      });
    }

    const conversation = await dbGet(
      `SELECT id FROM conversations WHERE id = ?`,
      [conversationId]
    );

    if (!conversation) {
      return res.status(400).json({
        error: "conversation_id does not exist"
      });
    }

    await dbRun(
      `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
      [conversationId, "user", message]
    );

    console.log("💬 USER MESSAGE:", message);

    const parsed = await routeMessageWithModel(message);
    console.log("💬 PARSED ROUTE:", JSON.stringify(parsed, null, 2));

    let finalReply = "";
    let toolResult = null;

    if (parsed.route === "tools") {
      toolResult = await executeTool(parsed);
      console.log("💬 TOOL RESULT:", JSON.stringify(toolResult, null, 2));
      finalReply = await formatToolResultWithModel(message, toolResult);
    } else {
      finalReply =
        parsed.response ||
        "I understood your message, but I do not have a response.";
    }

    await dbRun(
      `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
      [conversationId, "assistant", finalReply]
    );

    res.json({
      model_used: model || OLLAMA_MODEL,
      router_model: ROUTER_MODEL,
      parsed_route: parsed,
      tool_result: toolResult,
      response: finalReply
    });
  } catch (error) {
    console.error("CHAT ERROR:", error.message);
    next(error);
  }
}

module.exports = { chat };
