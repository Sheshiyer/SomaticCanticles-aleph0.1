import { db } from '../src/db';
import * as schema from '../src/db/schema';
import { hashPassword } from '../src/server/lib/crypto';
import { sql } from 'drizzle-orm';

// Types for our user generation
interface UserProfile {
    id: string;
    email: string;
    password: string; // cleartext
    role: 'user' | 'admin';
    name: string;
    birthdate: string | null;
    timezone: string;
}

const ADMIN_USER: UserProfile = {
    id: 'admin-dev-001',
    email: 'admin@somatic-canticles.local',
    password: 'SomaticDev44!',
    role: 'admin',
    name: 'System Admin',
    birthdate: '1980-01-01',
    timezone: 'UTC',
};

const TEST_USERS: UserProfile[] = [];

// Generate 15 test users
for (let i = 1; i <= 15; i++) {
    const paddedId = i.toString().padStart(2, '0');
    TEST_USERS.push({
        id: `user-dev-${paddedId}`,
        email: `user${paddedId}@example.com`,
        password: `Pass${paddedId}!`,
        role: 'user',
        name: `Test User ${paddedId}`,
        birthdate: `199${(i % 10)}-0${(i % 9) + 1}-15`,
        timezone: i % 2 === 0 ? 'America/New_York' : 'Europe/London',
    });
}

async function main() {
    const allUsers = [ADMIN_USER, ...TEST_USERS];

    console.log('🌱 Starting seed...');

    try {
        // 1. Clean existing data
        console.log('Cleaning existing data...');
        // We delete in order of foreign key constraints
        await db.delete(schema.streaks);
        await db.delete(schema.userProgress);
        await db.delete(schema.biorhythmSnapshots);
        await db.delete(schema.users);

        // 2. Insert Users
        console.log('Inserting users...');
        for (const user of allUsers) {
            const passwordHash = await hashPassword(user.password);

            await db.insert(schema.users).values({
                id: user.id,
                email: user.email,
                passwordHash: passwordHash,
                role: user.role,
                birthdate: user.birthdate,
                timezone: user.timezone,
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // 3. Insert Sample Progress
        console.log('Inserting sample progress...');

        // User 01 has completed Chapter 1
        await db.insert(schema.userProgress).values({
            id: 'up-01',
            userId: 'user-dev-01',
            chapterId: 1,
            unlockedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            completionPercentage: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // User 01 just unlocked Chapter 2
        await db.insert(schema.userProgress).values({
            id: 'up-02',
            userId: 'user-dev-01',
            chapterId: 2,
            unlockedAt: new Date().toISOString(),
            completedAt: null,
            completionPercentage: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // 4. Insert Sample Streaks
        console.log('Inserting sample streaks...');
        await db.insert(schema.streaks).values({
            id: 'str-01',
            userId: 'user-dev-01',
            streakType: 'daily_login',
            currentCount: 5,
            longestCount: 12,
            lastActivityDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await db.insert(schema.streaks).values({
            id: 'str-02',
            userId: 'user-dev-02',
            streakType: 'daily_login',
            currentCount: 1,
            longestCount: 3,
            lastActivityDate: new Date().toISOString().split('T')[0],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('✅ Seed completed successfully');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

main();
