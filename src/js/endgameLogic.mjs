// import { getHeroImg } from "./pokebank.mjs";
import { isValid, getWinner, getLoser, getLocalStorage, setBlur, hasContent, setClick, setClickAll, setLocalStorage, checkPass, displayMessage, addActions, tieGame, playAgain } from "./utils.mjs";
import { registerTrainer, displayTrainerStats } from "./trainer.mjs";

// const ct = getLocalStorage("currentTrainers")
// const t1 = getLocalStorage(ct[0]);
// const t2 = getLocalStorage(ct[1]);
// let winner;

export default async function endGameLoop() {
  // Get the current winner
  const winner = await getWinner();
  
  await displayTrainerStats(winner, "winner", true);

  // Ask the trainer to register
  if (winner.pass !== "secret" || !isValid(winner.pass) || winner.name === "prof oak" || winner.name === "prof elm") {
    // Message will not display if registered
    document.querySelector("#winFieldset").style.display = "none";
  } else {
    setBlur("#winPass", registerTrainer);
    setClickAll(".prime-btn", addActions);
  }
  setClick("#winAdvBtn", registerTrainer);
}

export async function gameOverLoop() {
  // Get the current loser
  const loser = await getLoser();
  
  await displayTrainerStats(loser, "loser", false);

  // Ask the trainer to register
  if (loser.pass !== "secret" || !isValid(loser.pass) || loser.name === "prof oak" || loser.name === "prof elm") {
    // Message will not display if registered
    document.querySelector("#lossFieldset").style.display = "none";
  } else {
    setBlur("#lossPass", registerTrainer);
    setClickAll(".prime-btn", addActions);
  }
  setClick("#playAgainBtn", playAgain);
  setClick("#lossAdvBtn", registerTrainer);
}

