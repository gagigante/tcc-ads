import express, { Request, Response } from "express";

export const app = express();

app.get('/', (request: Request, response: Response) => {
  return response.status(200).json({ hello: 'world' });
});
