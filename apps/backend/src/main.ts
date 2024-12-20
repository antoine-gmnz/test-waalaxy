import express from 'express';
import cors from 'cors';

import startProcessQueue from './processes/queue.process';
import startCreditRecalculation from './processes/credit.process';

import actionRouter from './routes/action.routes';
import queueRouter from './routes/queue.routes';
import actionTypeRouter from './routes/actionType.routes';
import { logger } from './utils/logger';
import { errorHandlerMiddleware } from './middleware/handleError.middleware';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200', // Front-end origin
  optionsSuccessStatus: 200,
};

// Apply CORS middleware to allow requests from the specified origin
app.use(cors(corsOptions));

// Express tools
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the jobs
startCreditRecalculation();
startProcessQueue();
logger.info('[SYSTEM] CRON Jobs started');

// Routers
app.use('/action', actionRouter);
app.use('/queue', queueRouter);
app.use('/actiontype', actionTypeRouter);

// Error handling middleware
app.use(errorHandlerMiddleware);

// Server boot
app.listen(port, host, () => {
  logger.info(`[ ready ] http://${host}:${port}`);
});
