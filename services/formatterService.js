const { OLLAMA_MODEL } = require("../config");
const { callOllamaGenerate } = require("./ollamaService");

async function formatToolResultWithModel(userMessage, toolResult) {
  if (Array.isArray(toolResult)) {
    if (toolResult.length === 0) {
      return "No matching records were found.";
    }

    const lowerMessage = String(userMessage || "").toLowerCase();

    if (lowerMessage.includes("how many")) {
      return `${toolResult.length} employee${toolResult.length === 1 ? "" : "s"} ${toolResult.length === 1 ? "was" : "were"} found.`;
    }

    if (toolResult.length === 1) {
      const person = toolResult[0];
      const fullName = `${person.first_name || ""} ${person.last_name || ""}`.trim();
      return `${fullName} was found.`;
    }

    const names = toolResult
      .map((row) => `${row.first_name || ""} ${row.last_name || ""}`.trim())
      .filter(Boolean);

    return `Found ${toolResult.length} employees: ${names.join(", ")}.`;
  }

  const formatterPrompt = `
You are a business response formatter.

You will receive:
1. a user question
2. a database result in JSON

Write exactly one plain-text response using only the provided database result.

Rules:
- Output plain text only
- No markdown
- No JSON
- No explanation of reasoning
- No follow-up question

User question:
${userMessage}

Database result:
${JSON.stringify(toolResult, null, 2)}
`;

  try {
    const raw = await callOllamaGenerate(OLLAMA_MODEL, formatterPrompt);
    return raw.trim();
  } catch (error) {
    console.error("FORMATTER MODEL ERROR:", error.message);
    return "I found a result, but could not format it.";
  }
}

module.exports = { formatToolResultWithModel };
