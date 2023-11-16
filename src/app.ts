import createError from 'http-errors';
import debugLib from 'debug';
import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import fs from 'fs';
import * as rfs from 'rotating-file-stream';
import moment from 'moment-timezone';
import indexRouter from './routes/index';

const app = express();
const debug = debugLib('express-standard:server');

function setupLogging() {
  const logDirectory = path.join(__dirname, 'logs');
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  const accessLogStream = rfs.createStream('access.log', {
    size: '10MB',
    interval: '1d',
    compress: 'gzip',
    path: logDirectory,
    rotate: 30
  });

  morgan.token('date', () => moment().tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'));
  app.use(morgan('short'));
  app.use(morgan(':date[clf] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
  app.use(morgan('combined', { stream: accessLogStream }));
}

function normalizePort(val: string): number | string | false {
  const port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
    case 'EADDRINUSE':
      console.error(`${bind} ${error.code === 'EACCES' ? 'requires elevated privileges' : 'is already in use'}`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  debug(`Listening on ${bind}`);
}

// Application setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use((_: Request, __: Response, next: NextFunction) => next(createError(404)));
app.use((err: any, req: Request, res: Response, _: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

setupLogging();
