TriMerge / Ollama Microserver Refactor

How to use:
1. Keep your existing db.js file in the project root.
2. Copy these folders/files into the same project root.
3. Install dependencies if needed:
   npm install express cors axios sqlite3
4. Start with:
   node server.js

Main improvement:
- server.js only starts the app
- app.js builds the express app
- routes/ maps endpoints
- controllers/ handle req/res
- services/ handle business logic and Ollama calls
- helpers/ contain reusable utility functions
- middleware/ handles 404 and errors

Endpoints preserved:
GET    /
GET    /health
POST   /users
GET    /users
POST   /conversations
GET    /conversations/:user_id
POST   /messages
GET    /messages/:conversation_id
POST   /staff
GET    /staff
POST   /staff/search
POST   /clients
GET    /clients
POST   /route-message
POST   /execute-tool
POST   /chat
