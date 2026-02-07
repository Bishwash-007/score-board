import { db } from '../config/database.js';
import { commentary } from '../db/schema.js';
import { desc, eq } from 'drizzle-orm';

export const getCommentaries = async (matchId, limit) => {
  const safeLimit = Math.min(limit, 100);

  return await db
    .select()
    .from(commentary)
    .where(eq(commentary.matchId, matchId))
    .orderBy(desc(commentary.createdAt))
    .limit(safeLimit);
};

export const createCommentary = async (matchId, data) => {
  const { minute, ...rest } = data;
  const [result] = await db
    .insert(commentary)
    .values({
      matchId,
      minute,
      ...rest,
    })
    .returning();
  return result;
};
