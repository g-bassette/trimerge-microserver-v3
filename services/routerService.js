const { ROUTER_MODEL } = require("../config");
const { safeJsonParse } = require("../helpers/parseHelpers");
const { normalizeDate } = require("../helpers/dateHelpers");
const { isStaffIntent } = require("../helpers/textHelpers");
const { callOllamaGenerate } = require("./ollamaService");

function extractStaffFiltersFromMessage(message = "") {
  const lower = message.toLowerCase();

  const filters = {
    hire_date: null,
    year: null,
    relative_year: null,
    relative_time: null,
    start_date: null,
    end_date: null
  };

  const yyyyMmDd = lower.match(/\b\d{4}-\d{1,2}-\d{1,2}\b/);
  const yyyySlashMmDd = lower.match(/\b\d{4}\/\d{1,2}\/\d{1,2}\b/);
  const mmDdYyyy = lower.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/);

  if (yyyyMmDd) {
    filters.hire_date = normalizeDate(yyyyMmDd[0]);
    return filters;
  }

  if (yyyySlashMmDd) {
    filters.hire_date = normalizeDate(yyyySlashMmDd[0]);
    return filters;
  }

  if (mmDdYyyy) {
    filters.hire_date = normalizeDate(mmDdYyyy[0]);
    return filters;
  }

  const yearMatch = lower.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    filters.year = yearMatch[1];
    return filters;
  }

  if (lower.includes("last year")) {
    filters.relative_year = "last_year";
    return filters;
  }

  if (lower.includes("this year")) {
    filters.relative_year = "this_year";
    return filters;
  }

  if (lower.includes("this month")) {
    filters.relative_time = "this_month";
    return filters;
  }

  if (lower.includes("last month")) {
    filters.relative_time = "last_month";
    return filters;
  }

  if (lower.includes("today")) {
    filters.relative_time = "today";
    return filters;
  }

  return filters;
}

function fallbackRouter(message = "") {
  if (isStaffIntent(message)) {
    return {
      route: "tools",
      toolname: "staff",
      mode: "retrieval",
      filters: extractStaffFiltersFromMessage(message),
      limit: null
    };
  }

  return {
    route: "text",
    response: "I can help with work-related questions and available tools."
  };
}

async function routeMessageWithModel(message) {
  const routerPrompt = `
You are a strict JSON routing model.

Return valid JSON only.
Do not add markdown.
Do not explain anything.

Allowed shapes:

For staff retrieval:
{
  "route": "tools",
  "toolname": "staff",
  "mode": "retrieval",
  "filters": {
    "hire_date": null,
    "year": null,
    "relative_year": null,
    "relative_time": null,
    "start_date": null,
    "end_date": null
  },
  "limit": null
}

For client retrieval:
{
  "route": "tools",
  "toolname": "clients",
  "mode": "retrieval",
  "filters": {
    "start_date": null,
    "end_date": null
  },
  "limit": null
}

For service creation:
{
  "route": "tools",
  "toolname": "create_service",
  "mode": "mutation"
}

For everything else:
{
  "route": "text",
  "response": "I can help with work-related questions and available tools."
}

User message:
${message}
`;

  try {
    const raw = await callOllamaGenerate(ROUTER_MODEL, routerPrompt);
    console.log("🧠 RAW ROUTER OUTPUT:", raw);

    const parsed = safeJsonParse(raw);

    if (parsed && parsed.route) {
      return parsed;
    }

    console.log("⚠️ Router output was not valid JSON. Using fallback.");
    return fallbackRouter(message);
  } catch (error) {
    console.error("ROUTER MODEL ERROR:", error.message);
    return fallbackRouter(message);
  }
}

module.exports = {
  extractStaffFiltersFromMessage,
  fallbackRouter,
  routeMessageWithModel
};
