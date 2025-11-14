// controllers/users.js
import { getCurrentUser, updateUserInfo } from '../services/users.js';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

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

export const patchUserInfoController = async (req, res) => {
  const sessionId = req.cookies?.sessionId;
  if (!sessionId) {
    throw createHttpError(401, 'No session cookie found');
  }

  const avatar = req.file;

  let avatarUrl;

  if (avatar) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      avatarUrl = await saveFileToCloudinary(avatar);
    } else {
      avatarUrl = await saveFileToUploadDir(avatar);
    }
  }

  const { user } = await updateUserInfo(sessionId, {
    ...req.body,
    ...(avatarUrl ? { avatar: avatarUrl } : {}),
  });

  res.json({
    status: 200,
    message: 'Successfully updated user info!',
    data: user,
  });
};
