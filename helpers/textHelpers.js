function normalizeToolName(toolname = "") {
  const t = String(toolname).toLowerCase().trim();

  if (
    [
      "staff",
      "employee",
      "employees",
      "staff member",
      "staff members",
      "team member",
      "team members",
      "worker",
      "workers",
      "new hire",
      "new hires",
      "hired person",
      "hired people"
    ].includes(t)
  ) {
    return "staff";
  }

  if (["client", "clients", "customer", "customers"].includes(t)) {
    return "clients";
  }

  return t;
}

function isStaffIntent(message = "") {
  const lower = message.toLowerCase();

  const peopleWords = [
    "employee",
    "employees",
    "staff",
    "staff member",
    "staff members",
    "team member",
    "team members",
    "worker",
    "workers",
    "new hire",
    "new hires",
    "hire",
    "hired",
    "joined",
    "manager",
    "admin",
    "accountant"
  ];

  return peopleWords.some((w) => lower.includes(w));
}

module.exports = {
  normalizeToolName,
  isStaffIntent
};
