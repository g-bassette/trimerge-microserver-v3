function parseLimit(value, fallback = 10) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return fallback;
  return n;
}

function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

module.exports = {
  parseLimit,
  parseId,
  safeJsonParse
};
