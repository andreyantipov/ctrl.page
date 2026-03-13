// biome-ignore lint/suspicious/noExplicitAny: Electrobun doesn't export Electroview type
export function defineRPC(Electroview: { defineRPC: (config: any) => any }) {
	return Electroview.defineRPC({
		handlers: {
			requests: {},
			messages: {},
		},
	});
}
