import { render } from "solid-js/web";
import App from "./App";

export function mount(rpcPromise: Promise<any>) {
  render(() => <App rpcPromise={rpcPromise} />, document.getElementById("root")!);
}
