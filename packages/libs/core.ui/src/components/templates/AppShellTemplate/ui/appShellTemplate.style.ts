import { sva } from "../../../../../styled-system/css";

export const appShellTemplate = sva({
	slots: ["root", "titleBar", "body", "content", "page"],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			height: "100%",
			width: "100%",
			bg: "bg.primary",
			overflow: "hidden",
			position: "relative",
		},
		titleBar: {
			display: "flex",
			alignItems: "center",
			height: "32px",
			px: "80px",
			flexShrink: 0,
			userSelect: "none",
		},
		body: {
			display: "flex",
			flexDirection: "row",
			flex: 1,
			minHeight: 0,
		},
		content: {
			display: "flex",
			flexDirection: "column",
			flex: 1,
			minWidth: 0,
			height: "100%",
			bg: "bg.primary",
		},
		page: {
			display: "flex",
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			overflow: "auto",
		},
	},
});
