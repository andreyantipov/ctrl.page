import type { MainRPCSchema } from "../bun/rpc";

export function defineRPC(Electroview: any) {
  return Electroview.defineRPC<MainRPCSchema>({
    handlers: {
      requests: {},
      messages: {},
    },
  });
}
