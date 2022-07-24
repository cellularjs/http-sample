import *  as  winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`),
      ),
      filename: './tmp/log/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      // maxFiles: '14d',
    })
  ],
});

if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(new winston.transports.Console({
    handleExceptions: true,
    handleRejections: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`),
    ),
  }));
}

winstonLogger.info('App - initializing');
