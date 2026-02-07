import { db } from '../config/database.js';
import { matches, commentary } from './schema.js';

const seed = async () => {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    console.log('Cleaning up old data...');
    await db.delete(commentary);
    await db.delete(matches);

    // Create Matches
    console.log('Creating matches...');
    
    // 1. Live Football Match
    const [liveMatch] = await db
      .insert(matches)
      .values({
        sport: 'Football',
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        status: 'live',
        startTime: new Date(Date.now() - 45 * 60 * 1000), // Started 45 mins ago
        homeScore: 1,
        awayScore: 1,
      })
      .returning();

    // 2. Scheduled Cricket Match
    await db.insert(matches).values({
      sport: 'Cricket',
      homeTeam: 'India',
      awayTeam: 'Australia',
      status: 'scheduled',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Starts in 24 hours
    });

    // 3. Finished Basketball Match
    const [finishedMatch] = await db
      .insert(matches)
      .values({
        sport: 'Basketball',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        status: 'finished',
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // Started 3 hours ago
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // Ended 1 hour ago
        homeScore: 110,
        awayScore: 108,
      })
      .returning();

    // Create Commentary for Live Match
    console.log('Adding commentary...');
    await db.insert(commentary).values([
      {
        matchId: liveMatch.id,
        minute: 1,
        sequence: 1,
        period: 1,
        eventType: 'kickoff',
        actor: 'Referee',
        team: 'N/A',
        message: 'The match has started!',
        tags: ['start'],
      },
      {
        matchId: liveMatch.id,
        minute: 12,
        sequence: 2,
        period: 1,
        eventType: 'goal',
        actor: 'Haaland',
        team: 'Manchester City',
        message: 'GOAL! Haaland strikes early to give City the lead.',
        tags: ['goal', 'home-team'],
      },
      {
        matchId: liveMatch.id,
        minute: 34,
        sequence: 3,
        period: 1,
        eventType: 'goal',
        actor: 'Salah',
        team: 'Liverpool',
        message: 'GOAL! Salah equalizes with a stunning finish.',
        tags: ['goal', 'away-team'],
      },
    ]);

    // Create Commentary for Finished Match
    await db.insert(commentary).values([
      {
        matchId: finishedMatch.id,
        minute: 48,
        sequence: 100,
        period: 4,
        eventType: 'full-time',
        actor: 'Referee',
        team: 'N/A',
        message: 'Full time! What a game.',
        tags: ['end'],
      },
    ]);

    console.log('✅ Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
