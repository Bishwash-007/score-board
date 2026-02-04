import { z } from 'zod';

export const MatchStatusSchema = z.enum(['scheduled', 'live', 'finished']);

const isoDateString = z.iso.datetime({
  message: 'Invalid ISO 8601 date string',
});

const positiveIntId = z.coerce.number().int().positive();

const paginationLimit = (defaultLimit, max = 100) =>
  z.coerce.number().int().min(1).max(max).default(defaultLimit);
export const listMatchesQuerySchema = z.object({
  limit: paginationLimit(10),
});

export const matchIdParamSchema = z.object({
  matchId: positiveIntId,
});

export const listCommentaryQuerySchema = z
  .object({
    startTime: isoDateString.optional(),
    endTime: isoDateString.optional(),
    limit: paginationLimit(20),
  })
  .refine(
    data => {
      if (!data.startTime || !data.endTime) return true;
      return new Date(data.endTime) >= new Date(data.startTime);
    },
    {
      message: 'endTime must be on or after startTime',
      path: ['endTime'],
    }
  );
export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, 'Sport is required').max(255),
    homeTeam: z.string().trim().min(1, 'Home team is required').max(255),
    awayTeam: z.string().trim().min(1, 'Away team is required').max(255),
    status: MatchStatusSchema.default('scheduled'),
    startTime: isoDateString,
    endTime: isoDateString.optional(),
    homeScore: z.number().int().nonnegative().default(0),
    awayScore: z.number().int().nonnegative().default(0),
  })
  .refine(
    data => {
      if (!data.endTime) return true;
      return new Date(data.endTime) > new Date(data.startTime);
    },
    {
      message: 'endTime must be after startTime',
      path: ['endTime'],
    }
  );

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
export const CommentarySchema = z.object({
  matchId: positiveIntId,
  minute: z.number().int().nonnegative(),
  sequence: z.number().int().nonnegative(),
  period: z.number().int().positive(),
  eventType: z.string().trim().min(1, 'Event type is required').max(50),
  actor: z.string().trim().min(1, 'Actor is required'),
  team: z.string().trim().min(1, 'Team is required'),
  message: z.string().trim().min(1, 'Message is required'),
  metaData: z.record(z.string(), z.unknown()).nullable().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});
