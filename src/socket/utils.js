import { WebSocket } from 'ws';

export const sendJSON = (socket, data) => {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(data));
};

export const broadcastJSON = (wss, data) => {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) return;
    client.send(message);
  });
};

export const sendError = (socket, errorMessage, errorCode = 500) => {
  sendJSON(socket, {
    status: 'error',
    error: {
      code: errorCode,
      message: errorMessage,
    },
  });
};
