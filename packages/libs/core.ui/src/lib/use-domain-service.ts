import type { Context, Stream } from "effect";
import { useService } from "./use-service";
import { useStream } from "./use-stream";

// biome-ignore lint/suspicious/noExplicitAny: stream type params are erased at the bridge boundary
export function useDomainService<I, A extends { changes: Stream.Stream<any, any, any> }>(
	tag: Context.Tag<I, A>,
) {
	const service = useService(tag);
	const data = useStream(service.changes, undefined);
	return { data, actions: service };
}
