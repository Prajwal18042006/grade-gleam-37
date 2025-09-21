import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add this line to allow your Render URL
    allowedHosts: ['grade-gleam.onrender.com'],
  },
  // Add the preview configuration to also allow the host in production
  preview: {
    port: 8080,
    allowedHosts: ['grade-gleam.onrender.com'],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
