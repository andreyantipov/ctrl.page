import type { AppCommand } from "@ctrl/core.shared";
import type { ElectrobunHandle } from "../model/handle";

const CHANNEL = "app-commands";

export const createIpcBridge = (handle: ElectrobunHandle) => {
	const subscribers = new Set<(command: AppCommand) => void>();

	// Listen for commands from the other process
	handle.addMessageListener(CHANNEL, (raw) => {
		console.info("[ipc-bridge] received command:", JSON.stringify(raw));
		const command = raw as AppCommand;
		for (const handler of subscribers) {
			handler(command);
		}
	});

	// Also listen with wildcard to catch ALL messages for debugging
	if ("addMessageListener" in handle && typeof handle.addMessageListener === "function") {
		try {
			(handle as unknown as { addMessageListener: (msg: string, fn: Function) => void })
				.addMessageListener("*", (messageName: string, payload: unknown) => {
					console.info("[ipc-bridge] wildcard message:", messageName, JSON.stringify(payload));
				});
		} catch {
			// Wildcard may not be supported
		}
	}

	return {
		send: (command: AppCommand): void => {
			handle.send[CHANNEL](command);
		},
		subscribe: (handler: (command: AppCommand) => void): (() => void) => {
			subscribers.add(handler);
			return () => {
				subscribers.delete(handler);
			};
		},
	};
};
