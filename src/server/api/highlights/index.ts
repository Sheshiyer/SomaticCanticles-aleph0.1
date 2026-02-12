/**
 * Highlights API Endpoints
 * 
 * GET    /api/highlights/chapter/:id - Get highlights for a specific chapter
 * POST   /api/highlights             - Create a new highlight
 * DELETE /api/highlights/:id         - Delete a highlight
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../index';
import { jwtAuth, type AuthVariables } from '../middleware/auth';
import { db } from '../../../db';
import { highlights } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const app = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

const createHighlightSchema = z.object({
    chapter_id: z.number().int(),
    scene_index: z.number().int(),
    text: z.string().min(1),
    color: z.enum(['primary', 'gold', 'resonance', 'danger']).optional().default('primary'),
});

/**
 * GET /api/highlights/chapter/:id
 * Returns all highlights for the authenticated user and a specific chapter
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

        const data = await db.query.highlights.findMany({
            where: (h, { eq, and }) => and(eq(h.userId, user.id), eq(h.chapterId, chapterId)),
            orderBy: (h, { asc }) => [asc(h.createdAt)],
        });

        return c.json({
            success: true,
            data: data.map(h => ({
                id: h.id,
                chapter_id: h.chapterId,
                scene_index: h.sceneIndex,
                text: h.text,
                color: h.color,
                created_at: h.createdAt?.toISOString(),
            })),
        }, 200);

    } catch (error) {
        console.error('Fetch highlights error:', error);
        return c.json({
            success: false,
            error: { code: 'FETCH_HIGHLIGHTS_ERROR', message: 'Failed to fetch highlights' },
        }, 500);
    }
});

/**
 * POST /api/highlights
 * Creates a new highlight
 */
app.post('/', jwtAuth, zValidator('json', createHighlightSchema), async (c) => {
    try {
        const user = c.get('user');
        const body = c.req.valid('json');

        const newHighlight = {
            id: `highlight_${nanoid(10)}`,
            userId: user.id,
            chapterId: body.chapter_id,
            sceneIndex: body.scene_index,
            text: body.text,
            color: body.color,
            createdAt: new Date(),
        };

        await db.insert(highlights).values(newHighlight);

        return c.json({
            success: true,
            data: {
                id: newHighlight.id,
                chapter_id: newHighlight.chapterId,
                scene_index: newHighlight.sceneIndex,
                text: newHighlight.text,
                color: newHighlight.color,
                created_at: newHighlight.createdAt.toISOString(),
            },
        }, 201);

    } catch (error) {
        console.error('Create highlight error:', error);
        return c.json({
            success: false,
            error: { code: 'CREATE_HIGHLIGHT_ERROR', message: 'Failed to create highlight' },
        }, 500);
    }
});

/**
 * DELETE /api/highlights/:id
 * Deletes a highlight
 */
app.delete('/:id', jwtAuth, async (c) => {
    try {
        const user = c.get('user');
        const id = c.req.param('id');

        const result = await db.delete(highlights)
            .where(and(eq(highlights.id, id), eq(highlights.userId, user.id)))
            .returning();

        if (result.length === 0) {
            return c.json({
                success: false,
                error: { code: 'HIGHLIGHT_NOT_FOUND', message: 'Highlight not found or unauthorized' },
            }, 404);
        }

        return c.json({
            success: true,
            data: { id, message: 'Highlight deleted' },
        }, 200);

    } catch (error) {
        console.error('Delete highlight error:', error);
        return c.json({
            success: false,
            error: { code: 'DELETE_HIGHLIGHT_ERROR', message: 'Failed to delete highlight' },
        }, 500);
    }
});

export default app;
