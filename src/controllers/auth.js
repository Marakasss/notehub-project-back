import { notesCollection } from '../db/models/notes.js';
import {
  loginOrSingupWithGoogle,
  loginUser,
  logOutUser,
  refreshUserSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth.js';
import { setupSession } from '../utils/setupSession.js';
import fs from 'fs';
import path from 'path';

//==============================================================

const demoNotesPath = path.resolve('./src/db/default/demo-notes.json');
const demoNotes = JSON.parse(fs.readFileSync(demoNotesPath, 'utf-8'));

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  const userDefaultNotes = demoNotes.map((note) => {
    return { userId: user._id, ...note };
  });
  await notesCollection.insertMany(userDefaultNotes);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

//==============================================================

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

//==============================================================

export const logOutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logOutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
  return;
};

//==============================================================

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    return res.status(401).json({
      status: 401,
      message: 'Invalid refresh token or session expired',
    });
  }

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

//==============================================================

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

//==============================================================

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

//==============================================================

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: { url },
  });
};

//==============================================================

export const loginOrSingupWithGoogleController = async (req, res) => {
  const session = await loginOrSingupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
