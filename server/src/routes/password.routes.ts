import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import { ForgotPasswordController } from '@/controllers/ForgotPasswordController';

const forgotPasswordController = new ForgotPasswordController();

// http://localhost:3333/password
const passwordRouter = Router();

passwordRouter.patch(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);

export { passwordRouter };
