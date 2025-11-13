import { Router } from 'express';
import { getNotesParamsValidationSchema } from '../validation/getNotesParamsValidationSchema.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import {
  createNoteController,
  deleteNoteController,
  getNoteByIdController,
  getNotesController,
  patchNoteController,
} from '../controllers/notes.js';
import { authenticate } from '../middlewares/aunthenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createNoteSchema, updateNoteSchema } from '../validation/notes.js';

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

router.post('/', validateBody(createNoteSchema), createNoteController);

//============================================================

router.patch(
  '/:noteId',
  isValidId,

  validateBody(updateNoteSchema),
  patchNoteController,
);

//============================================================

router.delete('/:noteId', isValidId, deleteNoteController);

export default router;
