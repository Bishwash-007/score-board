import { Router } from 'express';
import {
  createMatch,
  getMatch,
  getMatches,
  updateMatch,
} from '../controllers/matches.js';

const router = Router();

router.get('/', getMatches);
router.post('/', createMatch);
router.get('/:matchId', getMatch);
router.patch('/:matchId', updateMatch);

export default router;
