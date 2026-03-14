import { Effect, Fiber, Stream } from "effect";
import { type Accessor, createSignal, getOwner, onCleanup, onMount, runWithOwner } from "solid-js";
import { useRuntime } from "./runtime-provider";

// biome-ignore lint/suspicious/noExplicitAny: stream error/context types are erased at the bridge boundary
export function useStream<A>(stream: Stream.Stream<A, any, any>, initial: A): Accessor<A> {
	const [value, setValue] = createSignal(initial);
	const runtime = useRuntime();
	const owner = getOwner();

	onMount(() => {
		const fiber = runtime.runFork(
			stream.pipe(
				Stream.runForEach((a) =>
					// biome-ignore lint/suspicious/noExplicitAny: SolidJS signal setter requires cast
					Effect.sync(() => runWithOwner(owner, () => setValue(() => a as any))),
				),
			),
		);
		onCleanup(() => runtime.runFork(Fiber.interrupt(fiber)));
	});

	return value;
}
