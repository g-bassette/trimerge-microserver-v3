const { routeMessageWithModel } = require("../services/routerService");
const { executeTool } = require("../services/toolService");

async function routeMessage(req, res, next) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "message is required"
      });
    }

    const parsed = await routeMessageWithModel(message);
    res.json(parsed);
  } catch (error) {
    console.error("ROUTE MESSAGE ERROR:", error.message);
    next(error);
  }
}

async function executeParsedTool(req, res, next) {
  try {
    const parsed = req.body;

    if (!parsed || !parsed.route) {
      return res.status(400).json({
        error: "Valid parsed tool JSON is required"
      });
    }

    const result = await executeTool(parsed);
    res.json(result);
  } catch (error) {
    console.error("EXECUTE TOOL ERROR:", error.message);
    next(error);
  }
}

module.exports = { routeMessage, executeParsedTool };
