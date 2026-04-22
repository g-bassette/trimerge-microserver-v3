const { OLLAMA_URL, ROUTER_MODEL, OLLAMA_MODEL } = require("../config");
const { getTodayDate } = require("../helpers/dateHelpers");

function root(req, res) {
  res.json({
    message: "TriMerge microserver is running"
  });
}

function health(req, res) {
  res.json({
    status: "OK",
    ollama_url: OLLAMA_URL,
    router_model: ROUTER_MODEL,
    ollama_model: OLLAMA_MODEL,
    local_today: getTodayDate()
  });
}

module.exports = { root, health };
