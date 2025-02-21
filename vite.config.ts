
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'pdfjs-dist/build/pdf.worker.mjs']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist', 'pdfjs-dist/build/pdf.worker.mjs']
        }
      }
    }
  },
  // Copy PDF.js worker file to public directory during build
  publicDir: 'public',
  // Ensure PDF.js worker files are properly served
  assetsInclude: ['**/*.worker.js']
}));
