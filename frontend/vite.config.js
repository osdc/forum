import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	// Load environment variables based on the current mode & current working directory
	const env = loadEnv(mode, process.cwd(), "");

	return {
		// Path Aliases matching jsconfig.json
		resolve: {
			alias: {
				"@": resolve(import.meta.dirname, "src"),
				"@api": resolve(import.meta.dirname, "src/js/api"),
				"@assets": resolve(import.meta.dirname, "src/assets"),
				"@components": resolve(import.meta.dirname, "src/js/components"),
				"@css": resolve(import.meta.dirname, "src/css/"),
				"@utils": resolve(import.meta.dirname, "src/js/utils"),
			},
		},

		// Local Dev Server Configurations
		server: {
			port: 5173,
			open: "/index.html",
			proxy: {
				"/api": {
					target: env.VITE_FASTAPI_URL || "http://localhost:8000",
					changeOrigin: true,
					secure: false,
				},
			},
		},

		build: {
			outDir: "dist",
			emptyOutDir: true, // Clears /dist before build
			rolldownOptions: {
				input: {
					main: resolve(import.meta.dirname, "index.html"),
					forum: resolve(import.meta.dirname, "forum.html"),
					login: resolve(import.meta.dirname, "login.html"),
					createPost: resolve(import.meta.dirname, "create-post.html"),
				},
			},
		},
	};
});
