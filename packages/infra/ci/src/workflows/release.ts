import type { Directory, Secret } from "@dagger.io/dagger";
import { baseContainer, run } from "../lib/base";
import { defaultConfig } from "../lib/config";
import { withGitHubAuth, withGitIdentity } from "../lib/containers";

export async function release(
	source: Directory,
	githubToken: Secret,
	repositoryUrl: string,
): Promise<string> {
	const config = defaultConfig;
	const container = baseContainer(source, config);

	await run(
		withGitIdentity(withGitHubAuth(container, githubToken), config)
			.withEnvVariable("CI", "true")
			.withEnvVariable("GITHUB_ACTIONS", "true")
			.withExec(["git", "remote", "set-url", "origin", repositoryUrl])
			.withExec(["git", "checkout", config.releaseBranch]),
		["bunx", "semantic-release", "--branches", config.releaseBranch],
	).sync();

	return "Release complete";
}
