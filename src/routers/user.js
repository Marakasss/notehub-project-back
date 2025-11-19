import { Router } from 'express';
import { upload } from '../middlewares/multer.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateUserSchema } from '../validation/user.js';
import {
  getCurrentUserController,
  patchUserInfoController,
} from '../controllers/users.js';

const router = Router();

router.get('/me', getCurrentUserController);

router.patch(
  '/me',

  upload.single('avatar'),
  validateBody(updateUserSchema),
  patchUserInfoController,
);

export default router;
