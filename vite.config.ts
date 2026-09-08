import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
    }),
    react(),
  ],
})
