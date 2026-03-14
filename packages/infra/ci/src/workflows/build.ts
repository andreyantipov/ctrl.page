import type { Directory } from "@dagger.io/dagger";
import { baseContainer, run } from "../lib/base";

export async function build(source: Directory): Promise<string> {
	const container = baseContainer(source);
	await run(container, ["bun", "run", "build:ci"]).sync();
	return "Build passed";
}
