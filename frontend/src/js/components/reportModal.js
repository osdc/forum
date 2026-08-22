// Import component CSS as a raw string using Vite's ?inline
import stylesString from "@css/components/reportModal.css?inline";

// Parse into a constructable stylesheet
const reportStyles = new CSSStyleSheet();
reportStyles.replaceSync(stylesString);

class ReportModal extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.adoptedStyleSheets = [reportStyles];
		this.shadowRoot.innerHTML = `
            <dialog id="report-dialog">
                <h3>Select why you want to report</h3>
                <form id="report-form" method="dialog">
                    <div style="margin-bottom: 8px;">
                        <label><input type="radio" name="reason" value="spam" required> Spam</label>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label><input type="radio" name="reason" value="harassment"> Harassment</label>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label><input type="radio" name="reason" value="brokenrules"> Breaks forum rules</label>
                    </div>
                    <button type="button" id="cancel-btn">Cancel</button>
                    <button type="submit">Submit</button>
                </form>
            </dialog>
        `;
	}

	connectedCallback() {
		this.dialog = this.shadowRoot.querySelector("#report-dialog");
		this.form = this.shadowRoot.querySelector("#report-form");
		const cancelBtn = this.shadowRoot.querySelector("#cancel-btn");

		cancelBtn.addEventListener("click", () => {
			this.close();
		});

		this.form.addEventListener("submit", () => {
			const formData = new FormData(this.form);
			const reason = formData.get("reason");

			console.log("User reported this for: ", reason);

			this.form.reset();
		});
	}

	open() {
		this.dialog.showModal();
	}

	close() {
		this.dialog.close();
		this.form.reset();
	}
}

customElements.define("report-modal", ReportModal);
