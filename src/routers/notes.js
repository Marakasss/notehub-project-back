import { Router } from 'express';
import { getNotesParamsValidationSchema } from '../validation/getNotesParamsValidationSchema.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { getNotesController } from '../controllers/notes.js';
import { authenticate } from '../middlewares/aunthenticate.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  validateQuery(getNotesParamsValidationSchema),
  getNotesController,
);

export default router;
