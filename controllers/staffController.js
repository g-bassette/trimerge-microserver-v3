const { dbRun, dbGet, dbAll } = require("../helpers/dbHelpers");
const { normalizeDate, getTodayDate } = require("../helpers/dateHelpers");
const { executeTool } = require("../services/toolService");

async function createStaff(req, res, next) {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      role_title,
      department,
      hire_date,
      status
    } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        error: "first_name and last_name are required"
      });
    }

    const finalHireDate = normalizeDate(hire_date) || getTodayDate();

    const result = await dbRun(
      `
      INSERT INTO staff (
        first_name,
        last_name,
        email,
        phone,
        role_title,
        department,
        hire_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        String(first_name).trim(),
        String(last_name).trim(),
        email || null,
        phone || null,
        role_title || null,
        department || null,
        finalHireDate,
        status || "active"
      ]
    );

    const row = await dbGet(
      `
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
      WHERE id = ?
      `,
      [result.lastID]
    );

    res.status(201).json(row);
  } catch (error) {
    console.error("ADD STAFF ERROR:", error.message);
    next(error);
  }
}

async function getStaff(req, res, next) {
  try {
    const rows = await dbAll(
      `
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
      ORDER BY hire_date DESC, id DESC
      `
    );

    res.json(rows);
  } catch (error) {
    console.error("GET STAFF ERROR:", error.message);
    next(error);
  }
}

async function searchStaff(req, res, next) {
  try {
    const {
      hire_date,
      year,
      relative_year,
      relative_time,
      start_date,
      end_date,
      limit
    } = req.body;

    const parsed = {
      route: "tools",
      toolname: "staff",
      mode: "retrieval",
      limit: limit || 25,
      filters: {
        hire_date: hire_date || null,
        year: year || null,
        relative_year: relative_year || null,
        relative_time: relative_time || null,
        start_date: start_date || null,
        end_date: end_date || null
      }
    };

    const result = await executeTool(parsed);
    res.json(result);
  } catch (error) {
    console.error("STAFF SEARCH ERROR:", error.message);
    next(error);
  }
}

module.exports = { createStaff, getStaff, searchStaff };
