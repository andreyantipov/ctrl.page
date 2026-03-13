import type { Directory } from "@dagger.io/dagger";
import { baseContainer, run } from "../lib/base";

export async function lint(source: Directory): Promise<string> {
	const container = await baseContainer(source);
	await run(container, ["bun", "run", "lint"]).sync();
	return "Lint passed";
}

export async function typecheck(source: Directory): Promise<string> {
	const container = await baseContainer(source);
	await run(container, ["bun", "run", "check"]).sync();
	return "Typecheck passed";
}
