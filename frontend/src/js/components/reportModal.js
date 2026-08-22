class ReportModal extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
            <dialog id="report-dialog" style="padding: 20px; border: 1px solid black;">
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

		this.dialog = this.querySelector("#report-dialog");
		this.form = this.querySelector("#report-form");
		const cancelBtn = this.querySelector("#cancel-btn");

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
