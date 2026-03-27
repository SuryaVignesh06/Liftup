import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Liftup/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        program: resolve(__dirname, 'program.html'),
        builders: resolve(__dirname, 'builders.html'),
        buildathon: resolve(__dirname, 'buildathon.html'),
        applyStudent: resolve(__dirname, 'apply-student.html'),
        applyFounder: resolve(__dirname, 'apply-founder.html'),
        applyCollege: resolve(__dirname, 'apply-college.html'),
        trackAgent: resolve(__dirname, 'track-agent.html'),
        trackData: resolve(__dirname, 'track-data.html'),
        trackStartup: resolve(__dirname, 'track-startup.html'),
        trackWeb: resolve(__dirname, 'track-web.html'),
      }
    }
  }
})
