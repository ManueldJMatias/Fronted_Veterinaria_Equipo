import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ["**/WhatsApp Image 2026-11-25 at 9.31.02 PM.jpeg"],
    },
  },
});
