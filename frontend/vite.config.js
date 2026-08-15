import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  input: {
    main: resolve(__dirname, 'index.html'),
    login: resolve(__dirname, 'login.html'),
    forum: resolve(__dirname, 'forum.html'),
    createPost: resolve(__dirname, 'create-post.html'),
  },
})
