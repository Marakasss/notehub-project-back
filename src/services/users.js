// services/users.js
import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/users.js';
import createHttpError from 'http-errors';

export const getCurrentUser = async (sessionId) => {
  const session = await SessionCollection.findById(sessionId);
  if (!session) {
    throw createHttpError(401, 'Session expired or invalid');
  }

  const user = await UsersCollection.findById(session.userId).lean();
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return user;
};
