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
        // endgame: resolve(__dirname, "src/endgame/index.html"), 
        // gameover: resolve(__dirname, "src/gameover/index.html"), 
        // catch: resolve(__dirname, "src/catch/index.html"), 
      }, 
    }, 
  }, 
});