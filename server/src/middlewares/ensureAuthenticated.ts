import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { authConfig } from '@/config/auth';
import { AppError } from '@/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  subject: number;
}

export function ensureAuthenticated(
  req: Request,
  _: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { subject } = decoded as ITokenPayload;

    req.user = {
      id: subject,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
