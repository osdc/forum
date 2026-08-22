// Import component CSS as a raw string using Vite's ?inline
import stylesString from "@css/components/searchBar.css?inline";
import searchOutlineIcon from "@tabler/icons/outline/search.svg?raw";

// Parse into a constructable stylesheet
const searchStyles = new CSSStyleSheet();
searchStyles.replaceSync(stylesString);

class SearchBar extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.adoptedStyleSheets = [searchStyles];
		this.shadowRoot.innerHTML = `
      <form action="/search" method="GET">
        <input type="search" name="q" placeholder="   Search..." aria-label="Search">
        <button class="search-btn" type="submit">${searchOutlineIcon}</button>
      </form>
    `;
	}
}

customElements.define("search-bar", SearchBar);
