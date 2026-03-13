import type { Directory, Secret } from "@dagger.io/dagger";
import { baseContainer, run } from "../lib/base";

/**
 * Run semantic-release to create a version bump, changelog, and GitHub release.
 * Requires GITHUB_TOKEN for pushing tags and creating releases.
 */
export async function release(source: Directory, githubToken: Secret): Promise<string> {
	const container = await baseContainer(source);

	await run(
		container
			.withSecretVariable("GITHUB_TOKEN", githubToken)
			.withExec(["git", "config", "--global", "user.name", "github-actions[bot]"])
			.withExec([
				"git",
				"config",
				"--global",
				"user.email",
				"github-actions[bot]@users.noreply.github.com",
			]),
		["bunx", "semantic-release"],
	).sync();

	return "Release complete";
}
