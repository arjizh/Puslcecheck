import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// base: "./" -> relative Asset-Pfade, damit der Build sowohl unter der Domain-Root
// (Vercel) als auch unter einem Unterpfad (GitHub Pages) korrekt geladen wird.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
