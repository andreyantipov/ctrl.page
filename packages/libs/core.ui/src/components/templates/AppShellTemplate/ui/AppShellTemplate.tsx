import { createEffect, createSignal, type JSX, onCleanup, onMount, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { CommandCenter, type CommandCenterProps } from "../../../organisms/CommandCenter";
import { Notifications, notify } from "../../../organisms/Notifications";
import { Sidebar, type SidebarProps } from "../../../organisms/Sidebar";
import { appShellTemplate } from "./appShellTemplate.style";

type WebviewTagElement = HTMLElement & {
	loadURL: (url: string) => void;
	addMaskSelector: (selector: string) => void;
	removeMaskSelector: (selector: string) => void;
	toggleHidden: (hidden?: boolean) => void;
};

export type AppShellTemplateProps = {
	sidebar: SidebarProps;
	commandCenter: Omit<CommandCenterProps, "open" | "onClose">;
	currentUrl?: string;
	children?: JSX.Element;
};

export function AppShellTemplate(props: AppShellTemplateProps) {
	const $ = appShellTemplate;
	const [ccOpen, setCcOpen] = createSignal(false);
	let webviewRef: WebviewTagElement | undefined;

	function openCc() {
		setCcOpen(true);
		// Add mask so CommandCenter overlay receives clicks on top of the webview
		webviewRef?.addMaskSelector("[data-command-center-overlay]");
	}

	function closeCc() {
		setCcOpen(false);
		webviewRef?.removeMaskSelector("[data-command-center-overlay]");
	}

	function toggleCc() {
		if (ccOpen()) {
			closeCc();
		} else {
			openCc();
		}
	}

	function handleNewTab() {
		openCc();
		props.sidebar.onNewTab?.();
	}

	function handleCcSelect(id: string) {
		closeCc();
		props.commandCenter.onSelect?.(id);
	}

	function handleCcSubmitRaw(query: string) {
		closeCc();
		props.commandCenter.onSubmitRaw?.(query);
	}

	// Listen for global Cmd+K from Bun process (via Electrobun menu accelerator)
	function handleGlobalToggle() {
		notify.info("Cmd+K received", "IPC event arrived from Bun process");
		toggleCc();
	}

	// Also handle Cmd+K from DOM (when webview tag doesn't have focus)
	function handleKeyDown(e: KeyboardEvent) {
		if (e.metaKey && e.key === "k") {
			e.preventDefault();
			toggleCc();
		}
	}

	onMount(() => {
		window.addEventListener("ctrl:toggle-command-center", handleGlobalToggle);
		document.addEventListener("keydown", handleKeyDown);
	});

	onCleanup(() => {
		window.removeEventListener("ctrl:toggle-command-center", handleGlobalToggle);
		document.removeEventListener("keydown", handleKeyDown);
	});

	createEffect(() => {
		const url = props.currentUrl;
		if (webviewRef && url && url !== "about:blank") {
			webviewRef.loadURL(url);
		}
	});

	return (
		<div class={$().root}>
			<Sidebar {...props.sidebar} onNewTab={handleNewTab} />

			<div class={$().content}>
				<div class={$().page}>
					<Show when={props.currentUrl && props.currentUrl !== "about:blank"}>
						<Dynamic
							component="electrobun-webview"
							ref={(el: HTMLElement) => {
								webviewRef = el as WebviewTagElement;
							}}
							src={props.currentUrl}
							sandbox=""
							style="width: 100%; height: 100%; display: block;"
						/>
					</Show>
					{props.children}
				</div>
			</div>

			<CommandCenter
				{...props.commandCenter}
				open={ccOpen()}
				initialQuery={props.currentUrl}
				onClose={closeCc}
				onSelect={handleCcSelect}
				onSubmitRaw={handleCcSubmitRaw}
			/>

			<Notifications placement="bottom-end" />
		</div>
	);
}
