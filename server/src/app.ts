import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';

import '@/container';

import { createDatabaseConnection } from '@/database';
import { routes } from '@/routes';
import { AppError } from '@/errors/AppError';

createDatabaseConnection();

export const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use((err: Error, _req: Request, res: Response, _nextFunction: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});
