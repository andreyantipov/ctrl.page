import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "ctrl.page",
    identifier: "page.ctrl.app",
    version: "0.0.1",
  },
  runtime: {
    exitOnLastWindowClosed: true,
  },
  build: {
    bun: {
      entrypoint: "src/bun/index.ts",
    },
    views: {},
    copy: {
      "src/main-ui/index.html": "views/main-ui/index.html",
      "build/main-ui/index.js": "views/main-ui/index.js",
      "build/main-ui/styles.css": "views/main-ui/styles.css",
    },
    mac: {
      defaultRenderer: "native",
    },
    linux: {
      bundleCEF: true,
      defaultRenderer: "cef",
    },
  },
} satisfies ElectrobunConfig;
