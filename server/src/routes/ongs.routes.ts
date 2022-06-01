import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { OngsController } from '@/controllers/OngsController';

// http://localhost:3333/ongs
const ongsRouter = Router();

const ongsController = new OngsController();

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

export { ongsRouter };
