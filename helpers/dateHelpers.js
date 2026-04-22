function formatLocalDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDate(input) {
  if (!input) return null;

  const value = String(input).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  let match = value.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (match) {
    const [, yyyy, mm, dd] = match;
    return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }

  match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, mm, dd, yyyy] = match;
    return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }

  return null;
}

function getTodayDate() {
  return formatLocalDate(new Date());
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);

  return {
    startDate: formatLocalDate(start),
    endDate: formatLocalDate(end)
  };
}

module.exports = {
  formatLocalDate,
  normalizeDate,
  getTodayDate,
  getCurrentYear,
  getMonthRange
};
