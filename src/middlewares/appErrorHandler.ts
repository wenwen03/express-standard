import path from 'path';
import type { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as rfs from 'rotating-file-stream';

const logDirectory = path.join(__dirname, '../../logs/error');
const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
const logStream = rfs.createStream('error.log', {
  size: '10MB',
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
  rotate: 30,
});

export default function appErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  const errorLogContent = `${timestamp} - ${req.method} ${req.url} - ${err.message}\n`;
  logStream.write(errorLogContent);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message,
  });
}
