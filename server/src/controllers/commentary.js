import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from '../validations/commentary.js';
import { matchIdParamSchema } from '../validations/matches.js';
import * as commentaryService from '../services/commentary.js';
import { AppError } from '../utils/error.js';

export const getMatchCommentary = async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return res
      .status(400)
      .json({ error: 'Invalid match ID.', details: paramsResult.error.issues });
  }

  const queryResult = listCommentaryQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    return res.status(400).json({
      error: 'Invalid query parameters.',
      details: queryResult.error.issues,
    });
  }

  try {
    const { matchId } = paramsResult.data;
    const { limit = 10 } = queryResult.data;

    const results = await commentaryService.getCommentaries(matchId, limit);

    res.status(200).json({ data: results });
  } catch (error) {
    throw new AppError('Failed to fetch commentary.', 500, error);
  }
};

export const addCommentary = async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return res
      .status(400)
      .json({ error: 'Invalid match ID.', details: paramsResult.error.issues });
  }

  const bodyResult = createCommentarySchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: 'Invalid commentary payload.',
      details: bodyResult.error.issues,
    });
  }

  try {
    const result = await commentaryService.createCommentary(
      paramsResult.data.matchId,
      bodyResult.data
    );

    if (res.app.locals.broadcastCommentary) {
      res.app.locals.broadcastCommentary(result.matchId, result);
    }

    res.status(201).json({ data: result });
  } catch (error) {
    throw new AppError('Failed to add commentary.', 500, error);
  }
};
