// Import component CSS as a raw string using Vite's ?inline
import stylesString from "@css/components/tagsDropdown.css?inline";

// Parse into a constructable stylesheet
const tagsStyles = new CSSStyleSheet();
tagsStyles.replaceSync(stylesString);

class TagsDropdown extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.adoptedStyleSheets = [tagsStyles];
		this.shadowRoot.innerHTML = `
            <select class = "tags-toggle" name = "tags-toggle">
                <option value = "" disabled selected>Tags</option>
                <option value = "open-source">Open Source</option>
                <option value = "linux">Linux</option>
                <option value = "electronics">Electronics</option>
                <option value = "cp">Competitive Programming</option>
                <option value = "ai-ml">AI/ML</option>
                <option value = "ctf">CTF</option>
                <option value = "web-dev">Web Development</option>
                <option value = "app-dev">App Development</option>
                <option value = "game-dev">Game Development</option>
                <option value = "cybersecurity">Cybersecurity</option>
                <option value = "uncategorized">Uncategorized</option>
            </select>
        `;
	}

	connectedCallback() {
		const select = this.shadowRoot.querySelector(".tags-toggle");

		this._changeListener = (event) => {
			const selectedTag = event.target.value;

			this.dispatchEvent(
				new CustomEvent("tag-selected", {
					detail: { tag: selectedTag },
					bubbles: true,
					composed: true,
				}),
			);
		};

		select.addEventListener("change", this._changeListener);
	}

	disconnectedCallback() {
		const select = this.shadowRoot.querySelector(".tags-toggle");
		if (select) {
			select.removeEventListener("change", this._changeListener);
		}
	}
}

customElements.define("tags-dropdown", TagsDropdown);
