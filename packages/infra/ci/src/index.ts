import { type Directory, func, object } from "@dagger.io/dagger";
import { build } from "./workflows/build";
import { lint, typecheck } from "./workflows/lint";

@object()
// biome-ignore lint/correctness/noUnusedVariables: Exported via Dagger @object() decorator
class Ci {
	@func()
	async lint(source: Directory): Promise<string> {
		return lint(source);
	}

	@func()
	async typecheck(source: Directory): Promise<string> {
		return typecheck(source);
	}

	@func()
	async build(source: Directory): Promise<string> {
		return build(source);
	}
}
