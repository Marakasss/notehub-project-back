import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

export const setupSession = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: false,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
    maxAge: FIFTEEN_MINUTES,
    path: '/',
    secure: true,
    sameSite: 'None',
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    secure: true,
    sameSite: 'None',
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    encode: String,
    secure: true,
    sameSite: 'None',
  });
};
