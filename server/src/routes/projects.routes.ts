import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { ProjectsController } from '@/controllers/ProjectsController';
import { DonationsCountController } from '@/controllers/DonationsCountController';
import { DonationsSumController } from '@/controllers/DonationsSumController';
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated';
import { uploadConfig } from '@/config/upload';
import multer from 'multer';
import { ProjectThumbnailController } from '@/controllers/ProjectThumbnailController';
import { ProjectCoverController } from '@/controllers/ProjectCoverController';

// http://localhost:3333/projects
const projectsRouter = Router();
const upload = multer(uploadConfig.multer);

const projectsController = new ProjectsController();
const donationsCountController = new DonationsCountController();
const donationsSumController = new DonationsSumController();
const projectThumbnailController = new ProjectThumbnailController();
const projectCoverController = new ProjectCoverController();

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
      donation_value_goal: Joi.number().integer().allow(null),
      donation_goal: Joi.number().integer().allow(null),
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
      donation_value_goal: Joi.number().integer().allow(null),
      donation_goal: Joi.number().integer().allow(null),
    },
  }),
  projectsController.update,
);

projectsRouter.patch(
  '/:id/thumb',
  ensureAuthenticated,
  upload.single('file'),
  projectThumbnailController.update,
);

projectsRouter.patch(
  '/:id/banner',
  ensureAuthenticated,
  upload.single('file'),
  projectCoverController.update,
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
