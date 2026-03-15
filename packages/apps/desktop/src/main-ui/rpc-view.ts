// Electrobun doesn't export clean types for static Electroview methods.
// Type the parameter structurally based on the actual API surface we use.
type EmptyHandlers = Record<string, never>;

type MessageHandlers = {
	"effect-rpc": () => void;
	"toggle-command-center": () => void;
};

export function defineRPC<T>(ev: {
	defineRPC: (config: { handlers: { requests: EmptyHandlers; messages: MessageHandlers } }) => T;
}): T {
	return ev.defineRPC({
		handlers: {
			requests: {} as EmptyHandlers,
			messages: {
				"effect-rpc": () => {},
				"toggle-command-center": () => {
					// Dispatch a custom DOM event that AppShellTemplate listens for
					window.dispatchEvent(new CustomEvent("ctrl:toggle-command-center"));
				},
			},
		},
	});
}
