import { Router } from 'express';
import matchesRouter from './matches.js';
import commentaryRouter from './commentary.js';

const router = Router();
router.use('/matches', matchesRouter);
router.use('/commentary', commentaryRouter);
export default router;
