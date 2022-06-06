import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated';
import { UserController } from '@/controllers/UserController';
import { ActivateUserController } from '@/controllers/ActivateUserController';
import { UserDonationsController } from '@/controllers/UserDonationsController';

// http://localhost:3333/users
const usersRouter = Router();

const userController = new UserController();
const activateUserController = new ActivateUserController();
const userDonationsController = new UserDonationsController();

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

usersRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(), 
      cpf: Joi.string().required(), 
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      birth_date: Joi.date().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  userController.update,
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

usersRouter.get(
  '/donations',
  ensureAuthenticated,
  userDonationsController.index,
);

export { usersRouter };
