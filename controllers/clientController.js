const { dbRun, dbGet, dbAll } = require("../helpers/dbHelpers");
const { normalizeDate } = require("../helpers/dateHelpers");

async function createClient(req, res, next) {
  try {
    const {
      client_name,
      contact_name,
      email,
      phone,
      company_type,
      status,
      onboard_date
    } = req.body;

    if (!client_name) {
      return res.status(400).json({
        error: "client_name is required"
      });
    }

    const finalOnboardDate = normalizeDate(onboard_date) || null;

    const result = await dbRun(
      `
      INSERT INTO clients (
        client_name,
        contact_name,
        email,
        phone,
        company_type,
        status,
        onboard_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        String(client_name).trim(),
        contact_name || null,
        email || null,
        phone || null,
        company_type || null,
        status || "active",
        finalOnboardDate
      ]
    );

    const row = await dbGet(
      `
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
      WHERE id = ?
      `,
      [result.lastID]
    );

    res.status(201).json(row);
  } catch (error) {
    console.error("ADD CLIENT ERROR:", error.message);
    next(error);
  }
}

async function getClients(req, res, next) {
  try {
    const rows = await dbAll(
      `
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
      ORDER BY id DESC
      `
    );

    res.json(rows);
  } catch (error) {
    console.error("GET CLIENTS ERROR:", error.message);
    next(error);
  }
}

module.exports = { createClient, getClients };
