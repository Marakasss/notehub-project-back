import { Router } from 'express';
import notesRouter from './notes.js';
import authRouter from './auth.js';
import usersRouter from './user.js';

const router = Router();

router.use('/notes', notesRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);

export default router;
