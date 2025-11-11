import { Router } from 'express';
import notesRouter from './notes.js';
import authRouter from './auth.js';

const router = Router();

router.use('/notes', notesRouter);
router.use('/auth', authRouter);

export default router;
