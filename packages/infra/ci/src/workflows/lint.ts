import type { Directory } from "@dagger.io/dagger";
import { baseContainer, run } from "../lib/base";

export async function lint(source: Directory): Promise<string> {
	const container = await baseContainer(source);

	await run(container, ["bunx", "biome", "check", "."]).sync();
	// grit CLI panics in containers due to TLS/networking issues at startup
	// TODO: re-enable when grit fixes container support
	// await run(container, ["bunx", "@getgrit/cli", "check", "."]).sync();

	return "Lint passed";
}

export async function typecheck(source: Directory): Promise<string> {
	const container = await baseContainer(source);
	// turbo check depends on ^build, but build needs panda codegen first
	// Run build explicitly to generate styled-system/ and dist/ outputs
	await run(container, ["bunx", "turbo", "build", "--filter=!@ctrl/desktop"]).sync();
	await run(container, ["bun", "run", "check"]).sync();
	return "Typecheck passed";
}
