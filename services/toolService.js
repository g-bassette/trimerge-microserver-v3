const { normalizeToolName } = require("../helpers/textHelpers");
const { parseLimit } = require("../helpers/parseHelpers");
const {
  normalizeDate,
  getTodayDate,
  getCurrentYear,
  getMonthRange
} = require("../helpers/dateHelpers");
const { dbAll } = require("../helpers/dbHelpers");

async function executeStaffRetrieval(parsed) {
  const filters = parsed.filters || {};
  const limit = parseLimit(parsed.limit, 25);

  const exactDate = normalizeDate(filters.hire_date);
  const year = filters.year ? String(filters.year) : null;
  const relativeYear = filters.relative_year || null;
  const relativeTime = filters.relative_time || null;

  let startDate = normalizeDate(filters.start_date);
  let endDate = normalizeDate(filters.end_date);

  const currentYear = getCurrentYear();

  if (year) {
    startDate = `${year}-01-01`;
    endDate = `${year}-12-31`;
  } else if (relativeYear === "last_year") {
    const y = currentYear - 1;
    startDate = `${y}-01-01`;
    endDate = `${y}-12-31`;
  } else if (relativeYear === "this_year") {
    startDate = `${currentYear}-01-01`;
    endDate = `${currentYear}-12-31`;
  }

  if (relativeTime === "today") {
    startDate = getTodayDate();
    endDate = getTodayDate();
  } else if (relativeTime === "this_month") {
    const range = getMonthRange(0);
    startDate = range.startDate;
    endDate = range.endDate;
  } else if (relativeTime === "last_month") {
    const range = getMonthRange(-1);
    startDate = range.startDate;
    endDate = range.endDate;
  }

  let sql = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      role_title,
      department,
      hire_date,
      status,
      created_at
    FROM staff
    WHERE 1=1
  `;
  const params = [];

  if (exactDate) {
    sql += ` AND hire_date = ?`;
    params.push(exactDate);
  } else {
    if (startDate) {
      sql += ` AND hire_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      sql += ` AND hire_date <= ?`;
      params.push(endDate);
    }
  }

  sql += ` ORDER BY hire_date DESC, id DESC LIMIT ?`;
  params.push(limit);

  console.log("🗃️ STAFF SQL:", sql);
  console.log("🗃️ STAFF PARAMS:", params);

  return await dbAll(sql, params);
}

async function executeClientRetrieval(parsed) {
  const filters = parsed.filters || {};
  const limit = parseLimit(parsed.limit, 25);

  const startDate = normalizeDate(filters.start_date);
  const endDate = normalizeDate(filters.end_date);

  let sql = `
    SELECT
      id,
      client_name,
      contact_name,
      email,
      phone,
      company_type,
      status,
      onboard_date,
      created_at
    FROM clients
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    sql += ` AND onboard_date >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    sql += ` AND onboard_date <= ?`;
    params.push(endDate);
  }

  sql += ` ORDER BY id DESC LIMIT ?`;
  params.push(limit);

  return await dbAll(sql, params);
}

async function executeTool(parsed) {
  if (!parsed || parsed.route !== "tools") {
    return parsed;
  }

  const normalizedTool = normalizeToolName(parsed.toolname);
  console.log("⚙️ Tool triggered:", normalizedTool, "| mode:", parsed.mode);
  console.log("⚙️ Parsed payload:", JSON.stringify(parsed, null, 2));

  if (normalizedTool === "staff" && parsed.mode === "retrieval") {
    return await executeStaffRetrieval(parsed);
  }

  if (normalizedTool === "clients" && parsed.mode === "retrieval") {
    return await executeClientRetrieval(parsed);
  }

  if (normalizedTool === "create_service" && parsed.mode === "mutation") {
    return {
      status: "ready_for_execution",
      message: "Service creation routing worked."
    };
  }

  return {
    status: "unsupported_tool",
    toolname: parsed.toolname,
    mode: parsed.mode
  };
}

module.exports = {
  executeTool,
  executeStaffRetrieval,
  executeClientRetrieval
};
