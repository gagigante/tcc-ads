import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { ProjectsController } from '@/controllers/ProjectsController';
import { DonationsCountController } from '@/controllers/DonationsCountController';
import { DonationsSumController } from '@/controllers/DonationsSumController';
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated';

// http://localhost:3333/projects
const projectsRouter = Router();

const projectsController = new ProjectsController();
const donationsCountController = new DonationsCountController();
const donationsSumController = new DonationsSumController();

projectsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      search: Joi.string(),
    },
  }),
  projectsController.index,
);

projectsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      donation_description: Joi.string().required(),
      donation_value_goal: Joi.number().integer(),
      donation_goal: Joi.number().integer(),
    },
  }),
  projectsController.create,
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

projectsRouter.put(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      donation_description: Joi.string().required(),
      donation_value_goal: Joi.number().integer(),
      donation_goal: Joi.number().integer(),
    },
  }),
  projectsController.update,
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

projectsRouter.get(
  '/:id/donations/sum',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  donationsSumController.show,
);

export { projectsRouter };
