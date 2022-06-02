import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { ProjectsController } from '@/controllers/ProjectsController';
import { DonationsCountController } from '@/controllers/DonationsCountController';

// http://localhost:3333/projects
const projectsRouter = Router();

const projectsController = new ProjectsController();
const donationsCountController = new DonationsCountController();

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

projectsRouter.get(
  '/:id/donations/count',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  donationsCountController.show,
);

export { projectsRouter };
