// Import component CSS as a raw string using Vite's ?inline
import stylesString from "@css/components/themeToggle.css?inline";

// import desktopOutlineIcon from "@tabler/icons/outline/device-desktop.svg?raw";
// import sunOutlineIcon from "@tabler/icons/outline/sun-high.svg?raw";
// import moonOutlineIcon from "@tabler/icons/outline/moon-stars.svg?raw";

// Parse into a constructable stylesheet
const themeToggleStyles = new CSSStyleSheet();
themeToggleStyles.replaceSync(stylesString);

class ThemeToggle extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.adoptedStyleSheets = [themeToggleStyles];
		this.shadowRoot.innerHTML = `
        <select class="theme-toggle" name="theme-toggle">
            <option value="system">System</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
        </select>
    `;
	}
	connectedCallback() {
		const select = this.shadowRoot.querySelector(".theme-toggle");
		const applyTheme = (theme) => {
			if (theme === "system") {
				const systemDark = window.matchMedia(
					"(prefers-color-scheme: dark)",
				).matches;
				document.documentElement.setAttribute(
					"data-theme",
					systemDark ? "dark" : "light",
				);
			} else {
				document.documentElement.setAttribute("data-theme", theme);
			}
		};
		const getSavedTheme = () => {
			try {
				return localStorage.getItem("theme") || "system";
			} catch {
				return "system"; // localStorage unavailable (e.g. private browsing)
			}
		};
		const setSavedTheme = (theme) => {
			try {
				localStorage.setItem("theme", theme);
			} catch {}
		};

		const savedTheme = getSavedTheme();
		applyTheme(savedTheme);
		select.value = savedTheme; // guaranteed to match an <option>, since 'system' exists

		select.addEventListener("change", (event) => {
			const changeTheme = event.target.value;
			setSavedTheme(changeTheme);
			applyTheme(changeTheme);
		});

		this._mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		this._mediaListener = (event) => {
			if (getSavedTheme() === "system") {
				applyTheme(event.matches ? "dark" : "light");
			}
		};

		this._mediaQuery.addEventListener("change", this._mediaListener);
	}

	disconnectedCallback() {
		// avoids leaking/duplicating listeners if reconnected
		this._mediaQuery?.removeEventListener("change", this._mediaListener);
	}
}

customElements.define("theme-toggle", ThemeToggle);
