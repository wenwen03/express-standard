import http from 'http';
import debugLib from 'debug';

const debug = debugLib('express-standard:server');

export default function serverListener(server: http.Server): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  debug(`Listening on ${bind}`);
}
