import { useRuntime, useStream } from "@ctrl/core.ui";
import type { BrowsingState } from "@ctrl/domain.service.browsing";
import { BrowsingRpcs } from "@ctrl/domain.service.browsing";
import { RpcClient } from "@effect/rpc";
import { Stream } from "effect";

export function useBrowsingRpc() {
	const runtime = useRuntime();

	const client = runtime.runSync(RpcClient.make(BrowsingRpcs));

	const sessionStream = client.sessionChanges({}).pipe(Stream.orDie);

	const state = useStream<BrowsingState | undefined>(sessionStream, undefined);

	return { client, state };
}
