import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';

import { OngsController } from '@/controllers/OngsController';
import { OngProjectsController } from '@/controllers/OngProjectsController';
import { OngProjectsCountController } from '@/controllers/OngProjectsCountController';
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated';
import { OngThumbnailController } from '@/controllers/OngThumbnailController';
import { OngCoverController } from '@/controllers/OngCoverController';
import { uploadConfig } from '@/config/upload';
import { OngCollaboratorsController } from '@/controllers/OngCollaboratorsController';

// http://localhost:3333/ongs
const ongsRouter = Router();
const upload = multer(uploadConfig.multer);

const ongsController = new OngsController();
const ongProjectsController = new OngProjectsController();
const ongProjectsCountController = new OngProjectsCountController();
const ongThumbnailController = new OngThumbnailController();
const ongCoverController = new OngCoverController();
const ongCollaboratorsController = new OngCollaboratorsController();

ongsRouter.get(
  '/collaborators',
  ensureAuthenticated,
  ongCollaboratorsController.index,
);

ongsRouter.post(
  '/collaborators',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      role: Joi.string().valid('doador', 'colaborador', 'gestor').required(),
    },
  }),
  ongCollaboratorsController.create,
);

ongsRouter.delete(
  '/collaborators/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  ongCollaboratorsController.destroy,
);

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

ongsRouter.patch(
  '/:id/thumb',
  ensureAuthenticated,
  upload.single('file'),
  ongThumbnailController.update,
);

ongsRouter.patch(
  '/:id/banner',
  ensureAuthenticated,
  upload.single('file'),
  ongCoverController.update,
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
