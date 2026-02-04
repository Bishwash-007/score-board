import { Router } from 'express';
import matchesRouter from './matches.js';

const router = Router();
router.use('/matches', matchesRouter);

export default router;
