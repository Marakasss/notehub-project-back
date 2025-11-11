import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  loginWithGoogleOAuthSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPassSchema,
} from '../validation/auth.js';
import {
  getGoogleOAuthUrlController,
  loginOrSingupWithGoogleController,
  loginUserController,
  logOutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = new Router();

//----------------------------------------------------------------------

router.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController,
);

//---------------------------------------------------------------------

router.post('/login', validateBody(loginUserSchema), loginUserController);

//---------------------------------------------------------------------

router.post('/logout', logOutUserController);

//---------------------------------------------------------------------

router.post('/refresh', refreshUserSessionController);

//---------------------------------------------------------------------

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  requestResetEmailController,
);

//---------------------------------------------------------------------

router.post(
  '/reset-pwd',
  validateBody(resetPassSchema),
  resetPasswordController,
);

//---------------------------------------------------------------------

router.get('/get-oauth-url', getGoogleOAuthUrlController);

//---------------------------------------------------------------------

router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  loginOrSingupWithGoogleController,
);

//=====================================================================

export default router;
