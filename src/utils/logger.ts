
import winston from 'winston';

// Configure different formats for development and production
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  transports: [
    new winston.transports.Console(),
    // Add file transport in production
    ...(process.env.NODE_ENV === 'production' 
      ? [new winston.transports.File({ filename: 'error.log', level: 'error' })]
      : [])
  ]
});

export default logger;
