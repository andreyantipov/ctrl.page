import type { Directory } from "@dagger.io/dagger";
import { baseContainer, run } from "../lib/base";

export async function lint(source: Directory): Promise<string> {
	const container = baseContainer(source);
	await run(container, ["bun", "run", "lint:ci"]).sync();
	return "Lint passed";
}

export async function typecheck(source: Directory): Promise<string> {
	const container = baseContainer(source);
	const built = run(container, ["bun", "run", "build:ci"]);
	await run(built, ["bun", "run", "check"]).sync();
	return "Typecheck passed";
}
