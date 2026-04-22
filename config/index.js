module.exports = {
  PORT: process.env.PORT || 3002,
  OLLAMA_URL: process.env.OLLAMA_URL || "http://localhost:11434",
  ROUTER_MODEL: process.env.ROUTER_MODEL || "model_file_upgrade",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "qwen2.5:latest"
};
