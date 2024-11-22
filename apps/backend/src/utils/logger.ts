import pino from 'pino-http';
import pretty from 'pino-pretty';

// Logger
const prettyOptions = pretty({
  colorize: true,
});
const { logger } = pino({ level: 'debug' }, prettyOptions);

export { logger };
