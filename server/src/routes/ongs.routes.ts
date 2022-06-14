import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { OngsController } from '@/controllers/OngsController';
import { OngProjectsController } from '@/controllers/OngProjectsController';
import { OngProjectsCountController } from '@/controllers/OngProjectsCountController';
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated';

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

ongsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      cnpj: Joi.string().required(), 
      website_url: Joi.string(),
      whatsapp_url: Joi.string(),
    },
  }),
  ongsController.create,
);

ongsRouter.put(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      cnpj: Joi.string().required(), 
      website_url: Joi.string(),
      whatsapp_url: Joi.string(),
    },
  }),
  ongsController.update,
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
