import { db } from '../config/database.js';
import { matches } from '../db/schema.js';
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from '../validations/matches.js';
import { AppError } from '../utils/error.js';

export const createMatch = async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError('Validation Error', 400, parsed.error.errors);
  }

  const { startTime, endTime, ...rest } = parsed.data;

  try {
    const [match] = await db
      .insert(matches)
      .values({
        ...rest,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
      })
      .returning();

    return res.status(201).json({
      status: 'success',
      data: { match },
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
    const allMatches = await db
      .select()
      .from(matches)
      .orderBy(matches.startTime.desc())
      .limit(limit);

    return res.status(200).json({
      status: 'success',
      results: allMatches.length,
      data: { matches: allMatches },
    });
  } catch (error) {
    throw new AppError('Failed to fetch matches', 500, error.message);
  }
};
