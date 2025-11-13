// controllers/users.js
import { getCurrentUser } from '../services/users.js';
import createHttpError from 'http-errors';

export const getCurrentUserController = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId;
    if (!sessionId) {
      throw createHttpError(401, 'No session cookie found');
    }

    const user = await getCurrentUser(sessionId);

    res.json({
      status: 200,
      message: 'Successfully found user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
