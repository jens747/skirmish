import { getLocalStorage, setLocalStorage, shuffleCards, displayMessage, tieGame, checkPass, ce, qs } from "./utils.mjs";
import { getHeroImg } from "./pokebank.mjs";

// Set up new trainers
export default async function newTrainer(name, pass = "secret") {
  const p = getLocalStorage(name.toLowerCase());

  try {
    if (!p || p.name === "") {
      setLocalStorage(name, {
        "name": name,
        "pass": pass, 
        "wins": 0,
        "losses": 0,
        "draws": 0,
        "coins": 0, 
        "coinsEarned": 0, 
        "roundsWon": 0, 
        "roundsLost": 0, 
        "roundDraws": 0, 
        "skirmishCards": {}
      });
      // Clear data if user has not completed registration 
      // localStorage.removeItem("trainers");
      // Take user through registration
      // newTrainerModal();
    }
  } catch (error) {
    console.error("Trainer already exists: ", error);
  }
}

export async function updateSkirmishCards(name, pokeData, poke) {
  const trainer = getLocalStorage(name);

  if(trainer) {
    await pokeData.map(card => {
      const key = Object.keys(card);
      console.log(key);
      // console.log(pokeData);
      
      if (key[0] in trainer.skirmishCards) {
        console.log(`${key[0]} already exists, cannot add.`);
      } else {
        console.log(`Add ${key[0]}`);
        trainer.skirmishCards[key] = card;
      }
    });
    setLocalStorage(name, trainer);
  } else {
    console.log(`${name} not in localstorage.`);
  }
}

export function getTrainerDeck(name) {
  // Get trainer data from localstorage
  const trainer = getLocalStorage(name);
  // Place trainer cards in array
  const tCards = Object.values(trainer.skirmishCards).flatMap(card => Object.values(card));
  // Randomize player deck
  const tDeck = shuffleCards(tCards);
  
  return tDeck;
}

export function displayTrainerStats(trainer, state, result) {
  const draw = tieGame();
  // Create the <section> element
  const section = document.createElement("section");
  // "Winner" or "Loser"
  section.className = state;

  const h1 = document.createElement("h1");
  h1.className = "h1";
  draw 
    ? h1.textContent = "It's a draw." 
    : result 
      ? h1.textContent = "Congratulations!"
      : h1.textContent = "Sorry.";

  // Create the <h2> element for the name
  const h2 = document.createElement("h2");
  h2.className = "h2";
  draw
    // Trainer won
    ? h2.textContent = `Great game ${trainer.name}!`
      : result
        // Trainer lost
        ? h2.textContent = `${trainer.name} is the winner!`
        : h2.textContent = `You lost this round ${trainer.name}.`; 

  // Create a container for the game stats
  const resultSec = ce("section");
  resultSec.id = "resultSec";
  // section.appendChild(resultSec);

  // Display current game wins-losses-draws
  const resultRec = ce("h3");
  resultRec.id = "resultRec";
  resultRec.textContent = `Won: ${trainer.roundsWon} Lost: ${trainer.roundsLost} Drew: ${trainer.roundDraws}`;
  resultSec.appendChild(resultRec);

  // Display coins earned
  const resultCoins = ce("p");
  resultCoins.id = "resultCoins";
  resultCoins.innerHTML = `Earned <span id="smCoinIcon">C</span> ${trainer.coinsEarned} coins`;
  resultSec.appendChild(resultCoins);

  // Display button to visit trader and get more cards
  const tradeBtn = ce("button");
  tradeBtn.type = "button";
  tradeBtn.className = "modal-btn prime-btn opt-btn";
  tradeBtn.id = "trade-btn";
  tradeBtn.innerHTML = `Trade <span id="smCoinIcon">C</span> ${trainer.coins} coins`;
  tradeBtn.addEventListener("click", () => {
    setLocalStorage("trading", trainer.name);
    window.location.href = "/trader/index.html";
  });

  // Display button to view card collection
  const collectBtn = ce("button");
  collectBtn.type = "button";
  collectBtn.className = "modal-btn prime-btn opt-btn";
  collectBtn.id = "collect-btn";
  collectBtn.textContent = "Your Collection";
  collectBtn.addEventListener("click", () => {
    setLocalStorage("collecting", trainer.name);
    window.location.href = "/collection/index.html";
  });

  // Display the skiremon who won their match
  const secwin = document.createElement("section");
  secwin.className = "secwin";

  const secwinh3 = document.createElement("h3");
  secwinh3.textContent = "Won Skirmish";

  secwin.appendChild(secwinh3);

  const currentGame = trainer.currentGame;

  const winul = document.createElement("ul");
  winul.className = "skirelist";
  secwin.appendChild(winul);

  currentGame.win.map(w => {
    const skiremon = trainer.skirmishCards[[w]][w];
    console.log(skiremon);
    console.log(skiremon.name);
    console.log(getHeroImg(skiremon));
    const winli = document.createElement("li");
    winli.className = "skire";
    winli.textContent = skiremon.name;
    winul.appendChild(winli);

    // Append the skiremon image to the list
    const winpic = document.createElement("picture");
    winli.prepend(winpic);

    const winimg = document.createElement("img");
    // const winimg = document.createElement("source");
    winimg.setAttribute("style", "max-width: 80px");
    winimg.setAttribute("src", getHeroImg(skiremon));
    winimg.setAttribute("alt", `Image of a ${skiremon.name}`);
    winimg.className = "winImg";
    winpic.appendChild(winimg);
  });

  // Append content to the section
  section.appendChild(h2);
  section.appendChild(resultSec);

  // Append buttons to the form
  const trainerModal = qs(".trainer-modal");
  trainerModal.appendChild(tradeBtn);
  trainerModal.appendChild(collectBtn);

  // Display the Skiremon who lost their match
  const secloss = document.createElement("section");
  secloss.className = "secloss";

  const seclossh3 = document.createElement("h3");
  seclossh3.textContent = "Lost Skirmish";

  secloss.appendChild(seclossh3);

  const lossul = document.createElement("ul");
  lossul.className = "skirelist";
  secloss.appendChild(lossul);

  currentGame.lose.map(l => {
    const skiremon = trainer.skirmishCards[[l]][l];

    const lossli = document.createElement("li");
    lossli.className = "skire skirel";
    lossli.textContent = skiremon.name;
    lossul.appendChild(lossli);

    // Append the skiremon image to the list
    const losspic = document.createElement("picture");
    lossli.prepend(losspic);

    const lossimg = document.createElement("img");
    // const lossimg = document.createElement("source");
    lossimg.setAttribute("style", "max-width: 80px");
    lossimg.setAttribute("src", getHeroImg(skiremon));
    lossimg.setAttribute("alt", `Image of a ${skiremon.name}`);
    lossimg.className = "lossImg";
    losspic.appendChild(lossimg);
  });

  // Append the <section> to the body or another container in the document
  const main = document.querySelector("main");
  
  main.prepend(section);
  main.prepend(h1);
  main.appendChild(secwin);
  main.appendChild(secloss);
}

export function registerTrainer(event) {
  let content = event.target;
  console.log(content.value);
  if (content.value === "") {
    displayMessage("Your Trainer will not be saved if you advance.");
    
  } else if (checkPass(content.value)) {
    try {
      console.log("Password updated.");
      // location.assign("/gameover/index.html");
      // setClick("#winAdvBtn", addActions);
    } catch (error) {
      console.error("Error loading page: ", error);
    }
  } else {
    displayMessage("Please use a more complex password.");
  }
}
