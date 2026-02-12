/**
 * Bookmarks API Endpoints
 * 
 * GET    /api/bookmarks/chapter/:id - Get bookmarks for a specific chapter
 * POST   /api/bookmarks             - Create a new bookmark
 * DELETE /api/bookmarks/:id         - Delete a bookmark
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../index';
import { jwtAuth, type AuthVariables } from '../middleware/auth';
import { db } from '../../../db';
import { bookmarks } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const app = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

const createBookmarkSchema = z.object({
    chapter_id: z.number().int(),
    scene_index: z.number().int(),
});

/**
 * GET /api/bookmarks/chapter/:id
 * Returns all bookmarks for the authenticated user and a specific chapter
 */
app.get('/chapter/:id', jwtAuth, async (c) => {
    try {
        const user = c.get('user');
        const chapterId = parseInt(c.req.param('id'), 10);

        if (isNaN(chapterId)) {
            return c.json({
                success: false,
                error: { code: 'INVALID_CHAPTER_ID', message: 'Chapter ID must be a number' },
            }, 400);
        }

        const data = await db.query.bookmarks.findMany({
            where: (b, { eq, and }) => and(eq(b.userId, user.id), eq(b.chapterId, chapterId)),
            orderBy: (b, { asc }) => [asc(b.createdAt)],
        });

        return c.json({
            success: true,
            data: data.map(b => ({
                id: b.id,
                chapter_id: b.chapterId,
                scene_index: b.sceneIndex,
                created_at: b.createdAt?.toISOString(),
            })),
        }, 200);

    } catch (error) {
        console.error('Fetch bookmarks error:', error);
        return c.json({
            success: false,
            error: { code: 'FETCH_BOOKMARKS_ERROR', message: 'Failed to fetch bookmarks' },
        }, 500);
    }
});

/**
 * POST /api/bookmarks
 * Creates a new bookmark
 */
app.post('/', jwtAuth, zValidator('json', createBookmarkSchema), async (c) => {
    try {
        const user = c.get('user');
        const body = c.req.valid('json');

        const newBookmark = {
            id: `bookmark_${nanoid(10)}`,
            userId: user.id,
            chapterId: body.chapter_id,
            sceneIndex: body.scene_index,
            createdAt: new Date(),
        };

        await db.insert(bookmarks).values(newBookmark);

        return c.json({
            success: true,
            data: {
                id: newBookmark.id,
                chapter_id: newBookmark.chapterId,
                scene_index: newBookmark.sceneIndex,
                created_at: newBookmark.createdAt.toISOString(),
            },
        }, 201);

    } catch (error) {
        console.error('Create bookmark error:', error);
        return c.json({
            success: false,
            error: { code: 'CREATE_BOOKMARK_ERROR', message: 'Failed to create bookmark' },
        }, 500);
    }
});

/**
 * DELETE /api/bookmarks/:id
 * Deletes a bookmark
 */
app.delete('/:id', jwtAuth, async (c) => {
    try {
        const user = c.get('user');
        const id = c.req.param('id');

        const result = await db.delete(bookmarks)
            .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, user.id)))
            .returning();

        if (result.length === 0) {
            return c.json({
                success: false,
                error: { code: 'BOOKMARK_NOT_FOUND', message: 'Bookmark not found or unauthorized' },
            }, 404);
        }

        return c.json({
            success: true,
            data: { id, message: 'Bookmark removed' },
        }, 200);

    } catch (error) {
        console.error('Delete bookmark error:', error);
        return c.json({
            success: false,
            error: { code: 'DELETE_BOOKMARK_ERROR', message: 'Failed to delete bookmark' },
        }, 500);
    }
});

export default app;
