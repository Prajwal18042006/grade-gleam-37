import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Configuration for the development server
  server: {
    // This allows the server to be accessible from other machines on the network.
    // This is crucial for deployment on a containerized service like Render.
    host: "0.0.0.0",
    port: 8080,
  },

  // This is used for the production preview server.
  // It ensures the production build is accessible after deployment.
  preview: {
    host: true,
    port: 8080,
  },

  // List of Vite plugins to use
  plugins: [
    // Official Vite plugin for React, using SWC for faster compilation
    react(),
  ],

  // Configuration for path aliases
  resolve: {
    alias: {
      // Allows you to use '@' as an alias for the 'src' directory
      // For example, `import Component from '@/components/Component'`
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Specifies the output directory for the production build
  build: {
    outDir: "dist",
  },
});
