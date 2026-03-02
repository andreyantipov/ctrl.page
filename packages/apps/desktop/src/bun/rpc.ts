import { BrowserView } from "electrobun/bun";
import { APP_NAME, APP_VERSION } from "@ctrl/shared";

export type MainRPCSchema = {
  bun: {
    requests: {
      getAppInfo: {
        params: {};
        response: { name: string; version: string };
      };
    };
    messages: {};
  };
  webview: {
    requests: {};
    messages: {
      navigate: { url: string };
    };
  };
};

export const mainRPC = BrowserView.defineRPC<MainRPCSchema>({
  handlers: {
    requests: {
      getAppInfo: () => ({
        name: APP_NAME,
        version: APP_VERSION,
      }),
    },
    messages: {},
  },
});
