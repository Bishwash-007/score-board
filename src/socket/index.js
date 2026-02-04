import { WebSocketServer } from 'ws';
import { broadcastJSON, sendJSON } from './utils.js';
import logger from '../config/logger.js';

const state = {
  wss: null,
};

export const initWebSocket = server => {
  state.wss = new WebSocketServer({ server, path: '/ws' });
  const { wss } = state;

  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    logger.info(`New WebSocket connection from ${ip}`);

    // Send initial connection success message
    sendJSON(ws, {
      type: 'connection',
      status: 'connected',
      message: 'Welcome to Sports Stats Live Feed',
    });

    // Broadcast to all clients that a new user joined
    broadcastJSON(wss, {
      type: 'notification',
      message: `A new client has connected from ${ip}`,
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
      broadcastJSON(wss, {
        type: 'notification',
        message: `A client has disconnected from ${ip}`,
      });
    });

    ws.on('error', error => {
      logger.error(`WebSocket error: ${error.message}`);
    });
  });

  return wss;
};

export const getWss = () => {
  if (!state.wss) {
    throw new Error('WebSocket Server not initialized!');
  }
  return state.wss;
};

export const broadcastMatchUpdate = (matchId, data) => {
  if (!state.wss) return;
  broadcastJSON(state.wss, {
    type: 'MATCH_UPDATE',
    matchId,
    data,
  });
};
