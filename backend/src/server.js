const http = require('http');
const app = require('./app');
const { initializeWebSocket } = require('./routes/ws/sync');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
