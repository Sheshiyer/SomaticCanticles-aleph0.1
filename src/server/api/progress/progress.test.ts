import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test";
import { Hono } from "hono";

// Mock data
const mockUser = {
    id: "user-123",
    email: "test@example.com",
    role: "user",
};

const mockProgress = {
    id: "progress-1",
    userId: "user-123",
    chapterId: 1,
    unlockedAt: new Date().toISOString(),
    completedAt: null,
    timeSpentSeconds: 100,
    completionPercentage: 50,
    updatedAt: new Date(),
};

// Mock the database
const mockDb = {
    select: mock(() => ({
        from: mock(() => ({
            where: mock(() => ({
                orderBy: mock(() => ({
                    limit: mock(() => ({
                        offset: mock(() => [])
                    }))
                })),
                limit: mock(() => [mockProgress]),
            })),
            innerJoin: mock(() => ({
                where: mock(() => ({
                    orderBy: mock(() => ({
                        limit: mock(() => ({
                            offset: mock(() => [])
                        }))
                    })),
                    limit: mock(() => [mockProgress])
                }))
            }))
        })),
    })),
    update: mock(() => ({
        set: mock(() => ({
            where: mock(() => Promise.resolve()),
        })),
    })),
};

// Mock modules BEFORE importing the app
// Using relative paths which should work in a standard Bun environment
mock.module("../middleware/auth", () => ({
    jwtAuth: async (c: any, next: any) => {
        c.set("user", mockUser);
        await next();
    },
}));

mock.module("../../lib/db", () => ({
    db: mockDb,
}));

// Import the app after mocking
import app from "./index";

describe("Chapter Progress API", () => {
    describe("GET /stats", () => {
        it("should return progress stats", async () => {
            // Refine mock for stats query
            mockDb.select = mock(() => {
                const chain = {
                    from: mock(() => {
                        const fromChain = {
                            where: mock(() => [{ completedCount: 5, totalTimeSpent: 300 }]), // progressStats
                        };
                        return fromChain;
                    })
                };
                return chain;
            });

            const res = await app.request("/stats", {
                method: "GET",
            });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data).toHaveProperty("stats");
        });
    });

    describe("POST /track", () => {
        it("should track progress", async () => {
            // Reset mock to handle the select then update flow
            mockDb.select = mock(() => ({
                from: mock(() => ({
                    where: mock(() => ({
                        limit: mock(() => [mockProgress]) // Existing unlocked progress
                    }))
                }))
            }));

            const payload = {
                chapterId: 1,
                action: "progress",
                progressPercentage: 75,
                timeSpentSeconds: 60,
            };

            const res = await app.request("/track", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.success).toBe(true);
        });

        it("should return 403 if chapter is locked", async () => {
            // Mock empty result (locked/no progress)
            mockDb.select = mock(() => ({
                from: mock(() => ({
                    where: mock(() => ({
                        limit: mock(() => [])
                    }))
                }))
            }));

            const payload = {
                chapterId: 2,
                action: "start",
            };

            const res = await app.request("/track", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            expect(res.status).toBe(403);
        });
    });

    describe("GET /chapter/:id", () => {
        it("should return chapter progress", async () => {
            mockDb.select = mock(() => ({
                from: mock(() => ({
                    innerJoin: mock(() => ({
                        where: mock(() => ({
                            limit: mock(() => [mockProgress])
                        }))
                    }))
                }))
            }));

            const res = await app.request("/chapter/1", {
                method: "GET",
            });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.progress.chapterId).toBe(1);
        });

        it("should return 404 if not found", async () => {
            mockDb.select = mock(() => ({
                from: mock(() => ({
                    innerJoin: mock(() => ({
                        where: mock(() => ({
                            limit: mock(() => [])
                        }))
                    }))
                }))
            }));

            const res = await app.request("/chapter/999", {
                method: "GET",
            });

            expect(res.status).toBe(404);
        });
    });
});
