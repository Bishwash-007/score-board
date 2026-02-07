import * as p from 'drizzle-orm/pg-core';

export const matchStatusEnum = p.pgEnum('match_status', [
  'scheduled',
  'live',
  'finished',
]);

export const matches = p.pgTable('matches', {
  id: p.serial('id').primaryKey(),
  sport: p.varchar('sport', { length: 255 }).notNull(),
  homeTeam: p.varchar('home_team', { length: 255 }).notNull(),
  awayTeam: p.varchar('away_team', { length: 255 }).notNull(),
  status: matchStatusEnum('status').notNull().default('scheduled'),
  startTime: p.timestamp('start_time').notNull(),
  endTime: p.timestamp('end_time'),
  homeScore: p.integer('home_score').default(0).notNull(),
  awayScore: p.integer('away_score').default(0).notNull(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  updatedAt: p.timestamp('updated_at').defaultNow().notNull(),
});

export const commentary = p.pgTable('commentary', {
  id: p.serial('id').primaryKey(),
  matchId: p
    .integer('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  minute: p.integer('minute').notNull(),
  sequence: p.integer('sequence').notNull(),
  period: p.integer('period').notNull(),
  eventType: p.varchar('event_type', { length: 50 }).notNull(),
  actor: p.text('actor').notNull(),
  team: p.text('team').notNull(),
  message: p.text('message').notNull(),
  metaData: p.jsonb('meta_data'),
  tags: p.text('tags').array(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
});
