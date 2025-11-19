import createHttpError from 'http-errors';
import { SessionColection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/users.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    console.log('Please provide Authorization header');

    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    console.log('Auth header should be of type Bearer');

    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionColection.findOne({ accessToken: token });

  if (!session) {
    console.log('Session not found');

    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    console.log('Access token expired');

    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    console.log('user not found');

    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;

  next();
};
