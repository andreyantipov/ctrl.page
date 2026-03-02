import Electrobun, { BrowserWindow, ApplicationMenu } from "electrobun/bun";
import { APP_NAME, APP_VERSION } from "@ctrl/shared";
import { mainRPC } from "./rpc";

ApplicationMenu.setApplicationMenu([
  {
    submenu: [
      { label: `About ${APP_NAME}`, role: "about" },
      { type: "separator" },
      { label: "Quit", role: "quit", accelerator: "Cmd+Q" },
    ],
  },
  {
    label: "File",
    submenu: [
      { label: "Close Window", role: "close", accelerator: "Cmd+W" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" },
    ],
  },
  {
    label: "View",
    submenu: [
      { label: "Toggle Full Screen", role: "toggleFullScreen", accelerator: "Cmd+Ctrl+F" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
    ],
  },
]);

const win = new BrowserWindow({
  title: APP_NAME,
  url: "views://main-ui/index.html",
  frame: { x: 0, y: 0, width: 1200, height: 800 },
  titleBarStyle: "hiddenInset",
  transparent: false,
  rpc: mainRPC,
});

console.log(`${APP_NAME} v${APP_VERSION} started`);
