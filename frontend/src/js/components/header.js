import "./themeToggle.js";
import "./searchBar.js";
import logo from "@assets/osdc_logo.svg?raw";

// Import component CSS as a raw string using Vite's ?inline
import stylesString from "@css/components/header.css?inline";

import bellFilledIcon from "@tabler/icons/filled/bell.svg?raw";

// Parse into a constructable stylesheet
const headerStyles = new CSSStyleSheet();
headerStyles.replaceSync(stylesString);

class SiteHeader extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.adoptedStyleSheets = [headerStyles];
		this.shadowRoot.innerHTML = `
      <header>
        <a href="index.html" class="logo">
          ${logo}
        </a>
        <search-bar></search-bar>
        <div class="actions">
          <button class="notif-btn">${bellFilledIcon}</button>
          <theme-toggle></theme-toggle>
          <button class="profile-btn">JD</button>
        </div>
      </header>
    `;
	}
}

customElements.define("site-header", SiteHeader);
