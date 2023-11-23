import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export default function notFoundHandler(_: Request, res: Response, next: NextFunction) {
  if (!res.headersSent) {
    next(createError(404));
  }
}
