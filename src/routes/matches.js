import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.status(200).json({
    matches: [
      { id: 1, teamA: 'Team Alpha', teamB: 'Team Beta', scoreA: 2, scoreB: 1 },
      { id: 2, teamA: 'Team Gamma', teamB: 'Team Delta', scoreA: 0, scoreB: 0 },
    ],
  });
});

export default router;
