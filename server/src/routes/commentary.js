import { Router } from 'express';
import {
  addCommentary,
  getMatchCommentary,
} from '../controllers/commentary.js';

const router = Router();

router.get('/:matchId', getMatchCommentary);

router.post('/:matchId', addCommentary);

export default router;
