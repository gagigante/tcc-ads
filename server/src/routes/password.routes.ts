import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import { RedefinePasswordController } from '@/controllers/RedefinePasswordController';
import { ForgotPasswordController } from '@/controllers/ForgotPasswordController';

const redefinePasswordController = new RedefinePasswordController();
const forgotPasswordController = new ForgotPasswordController();

// http://localhost:3333/password
const passwordRouter = Router();

passwordRouter.post(
  '/redefine',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  redefinePasswordController.create,
);

passwordRouter.patch(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);

export { passwordRouter };
