import { NodeSdk } from "@effect/opentelemetry";
import type { ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { InMemorySpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { Context, Layer } from "effect";
import { expect } from "vitest";

export const TEST_SPAN_EXPORTER_ID = "TestSpanExporter" as const;

export class TestSpanExporter extends Context.Tag(TEST_SPAN_EXPORTER_ID)<
	TestSpanExporter,
	{
		readonly getFinishedSpans: () => readonly ReadableSpan[];
		readonly reset: () => void;
	}
>() {}

const makeTestSpanExporterLayer = (): Layer.Layer<TestSpanExporter> => {
	const exporter = new InMemorySpanExporter();
	const sdkLayer = NodeSdk.layer(() => ({
		spanProcessor: new SimpleSpanProcessor(exporter),
	}));
	return Layer.merge(
		sdkLayer,
		Layer.succeed(TestSpanExporter, {
			getFinishedSpans: () => exporter.getFinishedSpans(),
			reset: () => exporter.reset(),
		}),
	);
};

export const TestSpanExporterLive: Layer.Layer<TestSpanExporter> = makeTestSpanExporterLayer();

expect.extend({
	toContainSpan(received: readonly ReadableSpan[], expectedName: string) {
		const found = received.some((span) => span.name === expectedName);
		return {
			pass: found,
			message: () =>
				found
					? `Expected spans NOT to contain "${expectedName}"`
					: `Expected spans to contain "${expectedName}" but found: [${received.map((s) => s.name).join(", ")}]`,
		};
	},
});
