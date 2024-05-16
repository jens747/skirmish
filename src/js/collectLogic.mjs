import { qs, qsa, ce, getLocalStorage, setLocalStorage, setClickAll, displayMessage } from "./utils.mjs";
import { catchRandPoke, setSkireData, createSkireData } from "./pokebank.mjs";

export default function collectLoop() {
  // Get a selector for the back button
  const backBtn = qs("#collectBack");
  // Add an eventListener to the back button
  backBtn.addEventListener("click", function() {
    window.history.back();
  });

  // Get trainer's card collection
  getCollection();

  const listBtn = qs("#collectList");
  const gridBtn = qs("#collectGrid");

  // const buySkireCard = qs(".buySkireCard");
  const pokeCard = qsa(".poke-card");
  const skireDivTop = qsa(".skireDivTop");
  const skirePic = qsa("picture");
  const pokeImg = qsa(".pokeImg");
  const skireName = qsa(".skireName");
  const skireRecord = qsa(".skireRecord");
  const skireLife = qsa(".skireLife");
  const skireAtkStats = qsa(".skireAtkStats");
  const skireDefStats = qsa(".skireDefStats");
  const skireAtk = qsa(".skireAtk");
  const skireDef = qsa(".skireDef");
  const skireSpAtk = qsa(".skireSpAtk");
  const skireSpDef = qsa(".skireSpDef");
  const skireCardTypes = qsa(".skireCardTypes");

  listBtn.addEventListener("click", 
    function() {
      // buySkireCard.classList.add("listBuySkireCard");
      pokeCard.forEach(elm => {
        elm.classList.add("listPoke-card");
      });
      skireDivTop.forEach(elm => {
        elm.classList.add("listSkireDivTop");
      });
      skirePic.forEach(elm => {
        elm.classList.add("listPicture");
      });
      pokeImg.forEach(elm => {
        elm.classList.add("listImg");
      });
      skireName.forEach(elm => {
        elm.classList.add("listSkireName");
      });
      skireRecord.forEach(elm => {
        elm.classList.add("listSkireRecord");
      });
      skireLife.forEach(elm => {
        elm.classList.add("listSkireLife");
      });
      skireAtkStats.forEach(elm => {
        elm.classList.add("listSkireAtkStats");
      });
      // skireAtkStats.style.display = "grid";
      skireDefStats.forEach(elm => {
        elm.classList.add("listSkireDefStats");
      });
      // skireDefStats.style.display = "grid";
      skireAtk.forEach(elm => {
        elm.classList.add("listSkireAtk");
      });
      skireDef.forEach(elm => {
        elm.classList.add("listSkireDef");
      });
      skireSpAtk.forEach(elm => {
        elm.classList.add("listSkireSpAtk");
      });
      skireSpDef.forEach(elm => {
        elm.classList.add("listSkireSpDef");
      });
      skireCardTypes.forEach(elm => {
        elm.classList.add("listSkireCardTypes");
      });
    }
  );

  gridBtn.addEventListener("click", 
    function() {
      // buySkireCard.classList.remove("listBuySkireCard");
      pokeCard.forEach(elm => {
        elm.classList.remove("listPoke-card");
      });
      skireDivTop.forEach(elm => {
        elm.classList.remove("listSkireDivTop");
      });
      skirePic.forEach(elm => {
        elm.classList.remove("listPicture");
      });
      pokeImg.forEach(elm => {
        elm.classList.remove("listImg");
      });
      skireName.forEach(elm => {
        elm.classList.remove("listSkireName");
      });
      skireRecord.forEach(elm => {
        elm.classList.remove("listSkireRecord");
      });
      skireLife.forEach(elm => {
        elm.classList.remove("listSkireLife");
      });
      skireAtkStats.forEach(elm => {
        elm.classList.remove("listSkireAtkStats");
      });
      // skireAtkStats.style.display = "inline-block";
      skireDefStats.forEach(elm => {
        elm.classList.remove("listSkireDefStats");
      });
      // skireAtkStats.style.display = "inline-block";
      skireAtk.forEach(elm => {
        elm.classList.remove("listSkireAtk");
      });
      skireDef.forEach(elm => {
        elm.classList.remove("listSkireDef");
      });
      skireSpAtk.forEach(elm => {
        elm.classList.remove("listSkireSpAtk");
      });
      skireSpDef.forEach(elm => {
        elm.classList.remove("listSkireSpDef");
      });
      skireCardTypes.forEach(elm => {
        elm.classList.remove("listSkireCardTypes");
      });
    }
  );

  window.addEventListener("resize", function() {
    let screenWidth = window.innerWidth;

    if (screenWidth < 656) {
      gridBtn.click();
    }
  });
  // window.addEventListener("resize", function() {
  //   let screenWidth = window.innerWidth;
  //   console.log(`The viewable screen width is now ${screenWidth} pixels.`);
  // });
  

  
  const url = document.referrer;
  console.log(url);
  if (url.includes("endgame")) {
    // getTrades("skireForTradeA");
  }

  if (url.includes("gameover")) {
    // getTrades("skireForTradeB");
  }
}

export function getCollection() {
  // Get the name of the current trainer
  const name = getLocalStorage("collecting");
  // Get the trainer's info
  const trainer = getLocalStorage(name);
  // Get the menu selector
  const cm = qs("#collectMenu");

  // Set the coin value
  const cc = qs("#cCoins");
  cc.textContent = trainer.coins;

  // Set the win record
  const cw = qs("#cWins");
  cw.textContent = `W: ${trainer.wins}`;

  // Set the Loss record
  const cl = qs("#cLosses");
  cl.textContent = `L: ${trainer.losses}`;

  // Set the Draws record
  const cd = qs("#cDraws");
  cd.textContent = `D: ${trainer.draws}`;

  // Create h1 page title
  const ch1 = ce("h1");
  ch1.textContent = `${name}'s Collection`;
  ch1.className = "collectMenuH1";

  // Append h1 tag to main
  cm.appendChild(ch1);

  Object.values(trainer.skirmishCards).map(card => {
    setSkireData(card, false);
  })
}