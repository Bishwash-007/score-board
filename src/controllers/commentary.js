import { AppError } from '../utils/error.js';
import {
  createCommentarySchema,
//   listCommentaryQuerySchema,
} from '../validations/commentary.js';
import { matchIdParamSchema } from '../validations/matches.js';
import * as commentaryService from '../services/commentary.js';

export const getMatchCommentary = async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError('Validation Error', 400, paramsResult.error.errors);
  }

  // Optional: If you want to validate query params like limit/offset for pagination
  // const queryResult = listCommentaryQuerySchema.safeParse(req.query);
  // if (!queryResult.success) {
  //   throw new AppError('Validation Error', 400, queryResult.error.errors);
  // }

  try {
    const { matchId } = paramsResult.data;
    const commentary = await commentaryService.getCommentaryByMatchId(matchId);

    return res.status(200).json({
      status: 'success',
      results: commentary.length,
      data: { commentary },
    });
  } catch (error) {
    throw new AppError('Failed to fetch commentary', 500, error.message);
  }
};

export const addCommentary = async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    throw new AppError('Validation Error', 400, paramsResult.error.errors);
  }

  const bodyResult = createCommentarySchema.safeParse(req.body);
  if (!bodyResult.success) {
    throw new AppError('Validation Error', 400, bodyResult.error.errors);
  }

  try {
    const { matchId } = paramsResult.data;
    const { minute, ...rest } = bodyResult.data;

    const newCommentary = await commentaryService.createCommentaryEntry({
      matchId,
      minute,
      ...rest,
    });

    // Broadcast the new commentary
    // if (req.app.locals.broadcastCommentaryCreated) {
    //   req.app.locals.broadcastCommentaryCreated(newCommentary);
    // }

    return res.status(201).json({
      status: 'success',
      data: { commentary: newCommentary },
    });
  } catch (error) {
    throw new AppError('Failed to create commentary', 500, error.message);
  }
};
