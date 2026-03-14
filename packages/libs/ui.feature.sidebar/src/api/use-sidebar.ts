import { useRuntime, useStream } from "@ctrl/core.ui";
import type { BrowsingState } from "@ctrl/domain.service.browsing";
import { BrowsingRpcs } from "@ctrl/domain.service.browsing";
import { RpcClient } from "@effect/rpc";
import type { Protocol } from "@effect/rpc/RpcClient";
import { Effect, type ManagedRuntime, type Scope, Stream } from "effect";

export function useBrowsingRpc(): {
	client: RpcClient.FromGroup<typeof BrowsingRpcs>;
	state: () => BrowsingState | undefined;
} {
	// useRuntime() returns an untyped ManagedRuntime — cast to the webview layer
	// shape so runSync can accept an Effect that requires Protocol and Scope.
	const runtime = useRuntime() as unknown as ManagedRuntime.ManagedRuntime<
		Protocol | Scope.Scope,
		never
	>;

	// RpcClient.make requires Protocol (from the RPC layer) and Scope.
	// Effect.scoped closes the Scope; Protocol is provided by the webview runtime.
	const client = runtime.runSync(
		Effect.scoped(RpcClient.make(BrowsingRpcs)),
	) as RpcClient.FromGroup<typeof BrowsingRpcs>;

	const sessionStream = client.sessionChanges().pipe(Stream.orDie);

	const state = useStream<BrowsingState | undefined>(sessionStream, undefined);

	return { client, state };
}
