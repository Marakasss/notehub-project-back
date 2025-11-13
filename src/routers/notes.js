import { Router } from 'express';
import { getNotesParamsValidationSchema } from '../validation/getNotesParamsValidationSchema.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import {
  getNoteByIdController,
  getNotesController,
} from '../controllers/notes.js';
import { authenticate } from '../middlewares/aunthenticate.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.use(authenticate);

//============================================================

router.get(
  '/',
  validateQuery(getNotesParamsValidationSchema),
  getNotesController,
);

//============================================================

router.get('/:noteId', isValidId, getNoteByIdController);

//============================================================

export default router;
