import { desc, eq } from 'drizzle-orm';
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

export const getMatchById = async id => {
  const [match] = await db
    .select()
    .from(matches)
    .where(eq(matches.id, id))
    .limit(1);
  return match;
};

export const updateMatchEntry = async (id, data) => {
  const [updatedMatch] = await db
    .update(matches)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(matches.id, id))
    .returning();
  return updatedMatch;
};
