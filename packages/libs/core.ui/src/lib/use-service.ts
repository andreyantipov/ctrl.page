import type { Context } from "effect";
import { useRuntime } from "./runtime-provider";

export function useService<I, S>(tag: Context.Tag<I, S>): S {
	const runtime = useRuntime();
	return runtime.runSync(tag);
}
