import { type Container, type Directory, dag } from "@dagger.io/dagger";

export async function baseContainer(source: Directory): Promise<Container> {
	return dag
		.container()
		.from("oven/bun:latest")
		.withDirectory("/app", source)
		.withWorkdir("/app")
		.withExec(["bun", "install", "--frozen-lockfile"]);
}

export function run(container: Container, args: string[]): Container {
	return container.withExec(args);
}
