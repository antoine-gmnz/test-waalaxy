import startCreditRecalculation from './service/creditCron.service';
import actionRouter from './routes/action.routes';
import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

// Express tools
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the jobs
startCreditRecalculation();
console.log('[SYSTEM] CRON Jobs started');

// Routers
app.use('/action', actionRouter);

// Server boot
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
