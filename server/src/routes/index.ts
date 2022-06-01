import { Router } from 'express';
import multer from 'multer';

import { ongsRouter } from './ongs.routes';

import { uploadConfig } from '@/config/upload';

const routes = Router();
const upload = multer(uploadConfig.multer);

routes.use('/ongs', ongsRouter);

routes.get('/', (_req, res) => res.json({ ok: true }));

export { routes };