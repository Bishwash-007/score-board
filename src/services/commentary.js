import { eq, asc } from 'drizzle-orm';
import { db } from '../config/database.js';
import { commentary } from '../db/schema.js';

export const getCommentaryByMatchId = async matchId => {
  return await db
    .select()
    .from(commentary)
    .where(eq(commentary.matchId, matchId))
    .orderBy(asc(commentary.minute));
};

export const createCommentaryEntry = async data => {
  const [result] = await db.insert(commentary).values(data).returning();
  return result;
};
