// import { getHeroImg } from "./pokebank.mjs";
import { getWinner, getLoser, getLocalStorage, setBlur, hasContent, setClick, setClickAll, setLocalStorage, checkPass, displayMessage, addActions, tieGame, playAgain } from "./utils.mjs";
import { registerTrainer, displayTrainerStats } from "./trainer.mjs";

// const ct = getLocalStorage("currentTrainers")
// const t1 = getLocalStorage(ct[0]);
// const t2 = getLocalStorage(ct[1]);
// let winner;

export default function endGameLoop() {
  // Get the current winner
  const winner = getWinner();
  
  displayTrainerStats(winner, "winner", true);

  // Ask the trainer to register
  if (winner.pass !== "secret" || !winner.pass) {
    // Message will not display if registered
    document.querySelector("#winFieldset").style.display = "none";
  } else {
    setBlur("#winPass", registerTrainer);
    setClickAll(".prime-btn", addActions);
  }
  setClick("#winAdvBtn", registerTrainer);
}

export function gameOverLoop() {
  // Get the current loser
  const loser = getLoser();
  
  displayTrainerStats(loser, "loser", false);

  // Ask the trainer to register
  if (loser.pass !== "secret" || !loser.pass) {
    // Message will not display if registered
    document.querySelector("#lossFieldset").style.display = "none";
  } else {
    setBlur("#lossPass", registerTrainer);
    setClickAll(".prime-btn", addActions);
  }
  setClick("#playAgainBtn", playAgain);
  setClick("#lossAdvBtn", registerTrainer);
}

