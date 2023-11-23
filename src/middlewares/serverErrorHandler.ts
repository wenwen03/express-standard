export default function (error: NodeJS.ErrnoException, port: number | string) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
    case 'EADDRINUSE':
      console.error(
        `${bind} ${error.code === 'EACCES' ? 'requires elevated privileges' : 'is already in use'}`,
      );
      process.exit(1);
    default:
      throw error;
  }
}
