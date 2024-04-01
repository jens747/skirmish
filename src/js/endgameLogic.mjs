import { getLocalStorage, setBlur, hasContent, setClick, setLocalStorage } from "./utils.mjs";

const ct = getLocalStorage("currentTrainers")
const t1 = getLocalStorage(ct[0]);
const t2 = getLocalStorage(ct[1]);

export default function endGameLoop() {
  if (t1.currentGame.win.length() >= t2.currentGame.win.length()) {
    setClick("#winAdvBtn", registerTrainer);
  }
  setClick("#winAdvBtn", registerTrainer);
}

function registerTrainer() {
  let content = setBlur("#winEmail", hasContent);

  if (content) {
    try {
      location.assign("/gameover/index.html");
    } catch (error) {
      console.error("Error loading page: ", error);
    }
  }
}
