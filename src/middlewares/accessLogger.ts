import path from 'path';
import fs from 'fs';
import * as rfs from 'rotating-file-stream';
import morgan from 'morgan';

const logDirectory = path.join(__dirname, '../../logs/access');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
  size: '10MB',
  interval: '1d',
  compress: 'gzip',
  path: logDirectory,
  rotate: 30
});

const accessLogger = morgan('combined', { stream: accessLogStream });
export default accessLogger;

