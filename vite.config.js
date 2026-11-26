import { defineConfig } from "vite";

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/WhatsApp Image 2026-11-25 at 9.31.02 PM.jpeg"],
    },
  },
});
