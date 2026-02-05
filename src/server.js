import http from 'http';
import app from './app.js';
import { attachWebSocketServer } from './socket/index.js';

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

// Initialize WebSocket
const { broadcastMatchCreated, broadcastCommentaryCreated } =
  attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentaryCreated = broadcastCommentaryCreated;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running on ${baseUrl}`);
  console.log(
    `WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`
  );
});
