import { WebSocketServer } from 'ws';
import { sendJSON } from './utils.js';
import logger from '../config/logger.js';

export const initWebSocket = server => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    logger.info(`New WebSocket connection from ${ip}`);

    // Send initial connection success message
    sendJSON(ws, {
      type: 'connection',
      status: 'connected',
      message: 'Welcome to Sports Stats Live Feed',
    });

    ws.on('message', message => {
      try {
        const parsed = JSON.parse(message);
        logger.info(`Received message: ${JSON.stringify(parsed)}`);

        // Handle ping/pong or other control messages if needed
        if (parsed.type === 'ping') {
          sendJSON(ws, { type: 'pong' });
        }
      } catch (error) {
        logger.error(`WebSocket message error: ${error.message}`);
      }
    });

    ws.on('close', () => {
      logger.info(`WebSocket connection closed: ${ip}`);
    });

    ws.on('error', error => {
      logger.error(`WebSocket error: ${error.message}`);
    });
  });

  return wss;
};
