import { desc } from 'drizzle-orm';
import { db } from '../config/database.js';
import { matches } from '../db/schema.js';

export const createMatchEntry = async matchData => {
  const [match] = await db.insert(matches).values(matchData).returning();
  return match;
};

export const getRecentMatches = async (limit = 10) => {
  return await db
    .select()
    .from(matches)
    .orderBy(desc(matches.startTime))
    .limit(limit);
};
