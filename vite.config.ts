import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Liftup/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        program: resolve(__dirname, 'program.html'),
        builders: resolve(__dirname, 'builders.html'),
        buildathon: resolve(__dirname, 'buildathon.html'),
        'apply-student': resolve(__dirname, 'apply-student.html'),
        'apply-college': resolve(__dirname, 'apply-college.html'),
        'apply-founder': resolve(__dirname, 'apply-founder.html'),
        'track-web': resolve(__dirname, 'track-web.html'),
        'track-data': resolve(__dirname, 'track-data.html'),
        'track-startup': resolve(__dirname, 'track-startup.html'),
        'track-agent': resolve(__dirname, 'track-agent.html'),
      }
    }
  }
})
