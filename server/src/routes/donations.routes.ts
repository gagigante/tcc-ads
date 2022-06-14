import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';

import { DonationsController } from '@/controllers/DonationsController';
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated';

import { uploadConfig } from '@/config/upload';
import { UserDonationsController } from '@/controllers/UserDonationsController';

// http://localhost:3333/donations
const donationsRouter = Router();
const upload = multer(uploadConfig.multer);

const donationsController = new DonationsController();

donationsRouter.post(
  '/',
  ensureAuthenticated,
  upload.single('file'),
  // celebrate({
  //   [Segments.BODY]: {
  //     // search: Joi.file(),
  //   },
  // }),
  donationsController.create,
);





export { donationsRouter };
