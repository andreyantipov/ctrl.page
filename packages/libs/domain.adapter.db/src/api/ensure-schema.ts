import { LibsqlClient } from "@effect/sql-libsql";
import { Effect } from "effect";

/**
 * Ensures the database schema exists.
 * Raw SQL is acceptable here — this is the canonical migration entry-point
 * inside domain.adapter.db.
 */
export const ensureSchema = Effect.gen(function* () {
	const sql = yield* LibsqlClient.LibsqlClient;
	yield* sql`
		CREATE TABLE IF NOT EXISTS sessions (
			id TEXT PRIMARY KEY,
			mode TEXT NOT NULL DEFAULT 'visual',
			isActive INTEGER NOT NULL DEFAULT 0,
			currentIndex INTEGER NOT NULL DEFAULT 0,
			createdAt TEXT NOT NULL,
			updatedAt TEXT NOT NULL
		)
	`;
	yield* sql`
		CREATE TABLE IF NOT EXISTS pages (
			id TEXT PRIMARY KEY,
			sessionId TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
			url TEXT NOT NULL,
			title TEXT,
			pageIndex INTEGER NOT NULL,
			loadedAt TEXT NOT NULL
		)
	`;
});
