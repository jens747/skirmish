import { getHeroImg } from "./pokebank.mjs";
import { getWinner, getLocalStorage, setBlur, hasContent, setClick, setClickAll, setLocalStorage, checkPass, displayMessage, addActions } from "./utils.mjs";

// const ct = getLocalStorage("currentTrainers")
// const t1 = getLocalStorage(ct[0]);
// const t2 = getLocalStorage(ct[1]);
// let winner;

export default function endGameLoop() {
  // Get the current winner
  const winner = getWinner();
  
  displayTrainerStats(winner);

  setBlur("#winPass", registerTrainer);
  setClickAll(".prime-btn", addActions);
  setClick("#winAdvBtn", registerTrainer);
}

export function displayTrainerStats(trainer) {
  // Create the <section> element
  const section = document.createElement("section");
  section.className = "winner";

  const h1 = document.createElement("h1");
  h1.className = "winH1";
  h1.textContent = "Congratulations!";

  // Create the <h2> element for the name
  const h2 = document.createElement("h2");
  h2.className = "winH2";
  h2.textContent = `${trainer.name} is the winner!`; 

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
