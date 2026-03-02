import { createSignal, createResource, Show } from "solid-js";
import { Button, Text, Input } from "@ctrl/ui";

type AppProps = {
  rpcPromise: Promise<any>;
};

export default function App(props: AppProps) {
  const [appInfo] = createResource(async () => {
    try {
      const rpc = await props.rpcPromise;
      if (rpc?.request?.getAppInfo) {
        return await rpc.request.getAppInfo({});
      }
    } catch (e) {
      console.error("RPC error:", e);
    }
    return { name: "ctrl.page", version: "0.0.1" };
  });

  return (
    <div style={{ padding: "24px", display: "flex", "flex-direction": "column", gap: "16px" }}>
      <Text as="h1" variant="heading" size="2xl">
        {appInfo()?.name ?? "ctrl.page"}
      </Text>
      <Text variant="caption">v{appInfo()?.version ?? ""}</Text>
      <div style={{ display: "flex", gap: "8px" }}>
        <Input placeholder="Search..." />
        <Button variant="solid">Go</Button>
        <Button variant="outline">Settings</Button>
      </div>
    </div>
  );
}
