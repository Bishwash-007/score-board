import {
  createMatchSchema,
  listMatchesQuerySchema,
  matchIdParamSchema,
  updateMatchSchema,
} from '../validations/matches.js';
import { AppError } from '../utils/error.js';
import {
  createMatchEntry,
  getMatchById,
  getRecentMatches,
  updateMatchEntry,
} from '../services/matches.js';

export const createMatch = async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError('Validation Error', 400, parsed.error.errors);
  }

  const { startTime, endTime, ...rest } = parsed.data;

  try {
    const event = await createMatchEntry({
      ...rest,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
    });

    if (res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(event);
    }

    return res.status(201).json({
      status: 'success',
      data: { event },
    });
  } catch (error) {
    throw new AppError('Failed to create match', 500, error.message);
  }
};

export const getMatches = async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new AppError('Validation Error', 400, parsed.error.errors);
  }

  const { limit } = parsed.data;

  try {
    const allMatches = await getRecentMatches(limit);

    return res.status(200).json({
      status: 'success',
      results: allMatches.length,
      data: { matches: allMatches },
    });
  } catch (error) {
    throw new AppError('Failed to fetch matches', 500, error.message);
  }
};

export const getMatch = async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError('Invalid match ID', 400, paramsResult.error.errors);
  }

  try {
    const match = await getMatchById(paramsResult.data.matchId);

    if (!match) {
      throw new AppError('Match not found', 404);
    }

    return res.status(200).json({
      status: 'success',
      data: { match },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch match', 500, error.message);
  }
};

export const updateMatch = async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    throw new AppError('Invalid match ID', 400, paramsResult.error.errors);
  }

  const bodyResult = updateMatchSchema.safeParse(req.body);
  if (!bodyResult.success) {
    throw new AppError('Validation Error', 400, bodyResult.error.errors);
  }

  // Handle date formatting if present
  const data = { ...bodyResult.data };
  if (data.startTime) data.startTime = new Date(data.startTime);
  if (data.endTime) data.endTime = new Date(data.endTime);

  try {
    const updatedMatch = await updateMatchEntry(
      paramsResult.data.matchId,
      data
    );

    if (!updatedMatch) {
      throw new AppError('Match not found', 404);
    }

    return res.status(200).json({
      status: 'success',
      data: { match: updatedMatch },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update match', 500, error.message);
  }
};
