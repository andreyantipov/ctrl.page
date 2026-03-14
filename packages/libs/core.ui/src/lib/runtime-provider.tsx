import type { ManagedRuntime } from "effect";
import { createContext, type ParentProps, useContext } from "solid-js";

// biome-ignore lint/suspicious/noExplicitAny: generic runtime context accepts any layer shape
const RuntimeContext = createContext<ManagedRuntime.ManagedRuntime<any, any>>();

export function RuntimeProvider(
	// biome-ignore lint/suspicious/noExplicitAny: generic runtime context accepts any layer shape
	props: ParentProps<{ runtime: ManagedRuntime.ManagedRuntime<any, any> }>,
) {
	return <RuntimeContext.Provider value={props.runtime}>{props.children}</RuntimeContext.Provider>;
}

export function useRuntime() {
	const runtime = useContext(RuntimeContext);
	if (!runtime) throw new Error("RuntimeProvider not found — wrap your app in <RuntimeProvider>");
	return runtime;
}
