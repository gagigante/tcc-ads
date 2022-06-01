import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { ProjectsController } from '@/controllers/ProjectsController';

// http://localhost:3333/projects
const projectsRouter = Router();

const projectsController = new ProjectsController();

projectsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      search: Joi.string(),
    },
  }),
  projectsController.index,
);

projectsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  projectsController.show,
);

export { projectsRouter };
