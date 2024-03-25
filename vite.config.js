import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist", 
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        game: resolve(__dirname, "src/game/index.html"),
        // stats: resolve(__dirname, "src/stats/index.html"),
        // victory: resolve(__dirname, "src/victory/index.html"), 
        // loss: resolve(__dirname, "src/loss/index.html"), 
        // catch: resolve(__dirname, "src/catch/index.html"), 
      }, 
    }, 
  }, 
});