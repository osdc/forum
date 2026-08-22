document.addEventListener("tag-selected", async (event) => {
	const selectedTag = event.detail.tag;
	console.log("Filtering feed for tag:", selectedTag);

	const postContainer = document.querySelector("#posts-feed"); // or <post-list> element

	if (!postContainer) return;
});
