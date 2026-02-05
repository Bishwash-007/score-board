import {
  createMatchSchema,
  listMatchesQuerySchema,
} from '../validations/matches.js';
import { AppError } from '../utils/error.js';
import { createMatchEntry, getRecentMatches } from '../services/matches.js';

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
