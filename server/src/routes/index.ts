import { Router, Request, Response } from 'express';

const routes = Router();

routes.get('/', (request: Request, response: Response) => {
  return response.status(200).json({ hello: 'world' });
});

export { routes };