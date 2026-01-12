import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时使用仓库名作为 base path
  // 如果你的仓库名不是 jynoke，请修改为你的仓库名
  base: process.env.NODE_ENV === 'production' ? '/jynoke/' : '/',
  server: {
    port: 5177,
    open: true,
  },
})
