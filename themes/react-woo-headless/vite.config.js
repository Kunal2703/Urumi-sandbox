import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  // WordPress serves the theme from a nested URL — set base so Vite
  // resolves dynamic-import chunk URLs absolutely against /wp-content/.
  // This is what lets us drop inlineDynamicImports and ship per-route
  // and vendor chunks safely.
  base: '/wp-content/themes/react-woo-headless/dist/',
  plugins: [
    react(),
    // Pre-compress JS/CSS at build time. Servers that support
    // gzip_static / brotli_static (nginx) or mod_deflate
    // precompressed (Apache via .htaccess) serve the .gz/.br
    // sibling instead of compressing on every request.
    compression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
    compression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild',
    // No sourcemaps in prod — cuts ~10-15% off the JS payload.
    // Re-enable selectively if production debugging needed.
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    // Inline assets <= 8KB as base64 to save HTTP requests.
    // SVGs and tiny images become part of their parent chunk.
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;

          // framer-motion 12 ships as three packages — framer-motion (React
          // bindings), motion-dom (DOM runtime), motion-utils (shared utils).
          // Without these matchers, motion-dom + motion-utils (~65KB raw)
          // silently fall through to the `vendor` catchall, where they
          // load eagerly on pages that never animate (legal, blog index).
          if (id.includes('framer-motion') ||
              id.includes('motion-dom') ||
              id.includes('motion-utils')) return 'vendor-motion';

          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('lenis')) return 'vendor-lenis';

          // scheduler is React's microtask scheduler; co-locate with React
          // so the React paint path is one cache key, not two.
          if (id.includes('react-dom') ||
              id.includes('/scheduler/') ||
              id.includes('/react/') ||
              id.endsWith('/react')) return 'vendor-react';

          return 'vendor';
        }
      }
    },
    // Per-route CSS splitting — only the styles for the visible page load.
    cssCodeSplit: true
  },
  esbuild: {
    // Strip debugger statements always; strip console.* in prod only.
    // console.error stays useful in dev for catching crashed promises.
    drop: ['debugger'],
    pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
  }
})
