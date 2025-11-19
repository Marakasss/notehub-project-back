import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';
import { OAuth2Client } from 'google-auth-library';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const oauthConfig = JSON.parse(await readFile(PATH_JSON));
const googleOAuthClient = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const res = await googleOAuthClient.getToken(code);
  const id_token = res.tokens.id_token;

  if (!id_token) createHttpError(401, 'Unauthorisated');

  const tiket = await googleOAuthClient.verifyIdToken({
    idToken: id_token,
  });

  return tiket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';

  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};
