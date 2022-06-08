import { Router } from 'express';
import multer from 'multer';

import { ongsRouter } from './ongs.routes';
import { projectsRouter } from './projects.routes';
import { usersRouter } from './users.routes';
import { sessionsRouter } from './sessions.routes';
import { passwordRouter } from './password.routes';

import { uploadConfig } from '@/config/upload';

const routes = Router();
const upload = multer(uploadConfig.multer);

routes.use('/ongs', ongsRouter);
routes.use('/projects', projectsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);

routes.get('/', (_req, res) => res.json({ ok: true }));

export { routes };