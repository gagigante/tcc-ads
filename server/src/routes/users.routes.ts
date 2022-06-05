import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { UserController } from '@/controllers/UserController';
import { ActivateUserController } from '@/controllers/ActivateUserController';

// http://localhost:3333/users
const usersRouter = Router();

const userController = new UserController();
const activateUserController = new ActivateUserController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(), 
      cpf: Joi.string().required(), 
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      birth_date: Joi.date().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

usersRouter.patch(
  '/activate',
  celebrate({
    [Segments.QUERY]: {
      token: Joi.string().uuid().required(),
    },
  }),
  activateUserController.create,
);

export { usersRouter };
