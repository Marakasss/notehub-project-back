import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/users.js';
import createHttpError from 'http-errors';
import { SessionColection } from '../db/models/session.js';
import {
  demoNotes,
  FIFTEEN_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THIRTY_DAYS,
} from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth.js';
import { notesCollection } from '../db/models/notes.js';

//=====================================================================

export const registerUser = async (payload) => {
  const isUser = await UsersCollection.findOne({ email: payload.email });
  if (isUser) throw createHttpError(409, 'Email in use');

  const encryptedPass = await bcrypt.hash(payload.password, 10);

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const user = await UsersCollection.create({
    username: payload.email,
    ...payload,
    password: encryptedPass,
  });

  const session = await SessionColection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
  return { user, session };
};

//---------------------------------------------------------------------------

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionColection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionColection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

//---------------------------------------------------------------------------

export const logOutUser = async (sessionId) => {
  await SessionColection.deleteOne({ _id: sessionId });
};

//---------------------------------------------------------------------------

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionColection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    console.log('Session not found');

    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    console.log('Session token expired');
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionColection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionColection.create({
    userId: session.userId,
    ...newSession,
  });
};

//---------------------------------------------------------------------------

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'user not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPassTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-pass-email.html',
  );

  const templateSrc = (await fs.readFile(resetPassTemplatePath)).toString();

  const template = handlebars.compile(templateSrc);

  const html = template({
    name: user.name,
    link: `${getEnvVar(
      'RESET_PASSWORD_PAGE_DOMAIN',
    )}/reset-password?token=${resetToken}`,
  });

  await sendMail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

//---------------------------------------------------------------------------

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

//---------------------------------------------------------------------------

export const loginOrSingupWithGoogle = async (code) => {
  const loginTiket = await validateCode(code);
  const payload = loginTiket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      username: getFullNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  const newSession = createSession();

  const userDefaultNotes = demoNotes.map((note) => {
    return { userId: user._id, ...note };
  });
  await notesCollection.insertMany(userDefaultNotes);

  return await SessionColection.create({
    userId: user._id,
    ...newSession,
  });
};
