import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';

const logDirectory = path.join(__dirname, '../../logs/access');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
  size: '10MB',
  interval: '1d',
  compress: 'gzip',
  path: logDirectory,
  rotate: 30,
});

const accessLogger = morgan('combined', { stream: accessLogStream });
export default accessLogger;
