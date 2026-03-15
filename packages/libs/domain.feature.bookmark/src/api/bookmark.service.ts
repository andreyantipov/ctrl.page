import {
	type Bookmark,
	BookmarkRepository,
	type DatabaseError,
	withTracing,
} from "@ctrl/core.shared";
import { Context, Effect, Layer, PubSub, Stream } from "effect";
import { BOOKMARK_FEATURE } from "../lib/constants";

export class BookmarkFeature extends Context.Tag(BOOKMARK_FEATURE)<
	BookmarkFeature,
	{
		readonly getAll: () => Effect.Effect<Bookmark[], DatabaseError>;
		readonly create: (url: string, title: string | null) => Effect.Effect<Bookmark, DatabaseError>;
		readonly remove: (id: string) => Effect.Effect<void, DatabaseError>;
		readonly isBookmarked: (url: string) => Effect.Effect<boolean, DatabaseError>;
		readonly changes: Stream.Stream<Bookmark[]>;
	}
>() {}

export const BookmarkFeatureLive = Layer.effect(
	BookmarkFeature,
	Effect.gen(function* () {
		const repo = yield* BookmarkRepository;
		const pubsub = yield* PubSub.unbounded<Bookmark[]>();

		const notify = () =>
			repo.getAll().pipe(Effect.flatMap((bookmarks) => PubSub.publish(pubsub, bookmarks)));

		return withTracing(BOOKMARK_FEATURE, {
			getAll: () => repo.getAll(),

			create: (url: string, title: string | null) =>
				repo.create(url, title).pipe(Effect.tap(() => notify().pipe(Effect.ignore))),

			remove: (id: string) => repo.remove(id).pipe(Effect.tap(() => notify().pipe(Effect.ignore))),

			isBookmarked: (url: string) => repo.findByUrl(url).pipe(Effect.map((b) => b !== undefined)),

			changes: Stream.fromPubSub(pubsub),
		});
	}),
);
