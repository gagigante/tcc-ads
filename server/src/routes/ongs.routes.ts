import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { OngsController } from '@/controllers/OngsController';
import { OngProjectsController } from '@/controllers/OngProjectsController';
import { OngProjectsCountController } from '@/controllers/OngProjectsCountController';

// http://localhost:3333/ongs
const ongsRouter = Router();

const ongsController = new OngsController();
const ongProjectsController = new OngProjectsController();
const ongProjectsCountController = new OngProjectsCountController();

ongsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      search: Joi.string(),
    },
  }),
  ongsController.index,
);

ongsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  ongsController.show,
);

ongsRouter.get(
  '/:id/projects',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  ongProjectsController.index,
);

ongsRouter.get(
  '/:id/projects/count',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  ongProjectsCountController.show,
);

export { ongsRouter };
