import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	appType: "mpa",
	build: {
		rolldownOptions: {
			input: {
				main: resolve(import.meta.dirname, "index.html"),
				login: resolve(import.meta.dirname, "login.html"),
				forum: resolve(import.meta.dirname, "forum.html"),
				createPost: resolve(import.meta.dirname, "create-post.html"),
			},
		},
	},
});
