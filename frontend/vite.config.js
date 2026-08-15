import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  input: {
    main: resolve(__dirname, 'index.html'),
    login: resolve(__dirname, 'login/index.html'),
    forum: resolve(__dirname, 'forum/index.html'),
    thread: resolve(__dirname, 'thread/index.html'),
  },
})
