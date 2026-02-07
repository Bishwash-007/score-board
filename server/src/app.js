import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './config/logger.js';
import { buildExpressErrorHandler } from './utils/error.js';

import routes from './routes/index.js';
import { securityMiddleware } from './config/arcjet.js';

// initialize an express app
const app = express();

// middlewares
app.use(securityMiddleware);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(buildExpressErrorHandler(logger));
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

// routes
app.get('/', (_, res) => {
  logger.info('Hello From Scoreboard api');
  res.status(200).send('Hello From Scoreboard api');
});
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.use('/api/v1', routes);
app.get('/api', (_, res) => {
  res.status(200).json({
    message: 'Scoreboard api is Up and Running!',
  });
});
app.use((_, res) => {
  res.status(404).json({ error: 'Route Not Found' });
});
export default app;
