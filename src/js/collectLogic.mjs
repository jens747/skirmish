import { qs, qsa, ce, getLocalStorage, setLocalStorage, setClick, setClickAll, displayMessage } from "./utils.mjs";
import { catchRandPoke, setSkireData, createSkireData } from "./pokebank.mjs";
import { searchDB } from "../db/indexdb";

export default async function collectLoop() {
  // Get a selector for the back button
  const backBtn = qs("#collectBack");
  // Add an eventListener to the back button
  backBtn.addEventListener("click", function() {
    window.history.back();
  });

  // Get trainer's card collection
  await getCollection();

  // const alphaDescBtn = qs("#collectAlphaDesc");
  // const idAscBtn = qs("#collectIdAsc");

  setClick("#collectAlphaDesc", orderAlpaDesc);
  setClick("#collectIdAsc", orderIdAsc);

  const listBtn = qs("#collectList");
  const gridBtn = qs("#collectGrid");

  // Add listeners to all elements
  setCollectListeners(listBtn, gridBtn)

  // Measures the screen when resized 
  window.addEventListener("resize", function() {
    let screenWidth = window.innerWidth;

    // Clicks gridBtn if screen is less than 656px
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

export async function getCollection() {
  // Get the name of the current trainer
  const name = getLocalStorage("collecting");
  // Get the trainer's info
  // const trainer = getLocalStorage(name);
  const trainer = await searchDB(name);
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
    console.log(card);
    setSkireData(card, false);
  });
}

export async function setCollectListeners(listBtn, gridBtn) {
  
  // const buySkireCard = qs(".buySkireCard");
  const pokeCard = document.querySelectorAll(".poke-card");
  // const pokeCard = qsa(".poke-card");
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
}

export async function orderAlpaDesc() {
  // Get the name of the current trainer
  const trainerName = getLocalStorage("collecting");
  // Get the trainer's info
  // const trainerDeck = getLocalStorage(trainerName);
  const trainerDeck = await searchDB(trainerName);

  const cards = qsa(".poke-card");
  // console.log(cards);
  
  const cardName = Array.from(cards).map(card => card.children[3].textContent);

  // Sort the array numerically
  cardName.sort();

  console.log(cardName);

  let obval = Array.from(cardName).map(card => findObjectByName(card, trainerDeck));
  console.log(obval);

}

// Function to find an object by name
export function findObjectByName(name, trainer) {
  console.log(name);
  console.log(trainer);
  return Object.values(trainer.skirmishCards).find(obj => obj.name === name);
}

export function orderIdAsc() {
  // Select all cards
  const cards = qsa(".poke-card");
  // console.log(cards);
  
  // map through the cards
  const cardId = Array.from(cards).map(card => {
    // Get the text from the tag
    let str = card.children[1].firstChild.textContent;

    // Split the string into an array
    let parts = str.split(" ");

    // Get the last element of the split array
    return parseInt(parts[parts.length - 1], 10);
  });

  // Sort the array numerically
  cardId.sort((a, b) => a - b);
  // Descending order
  // cardId.sort((a, b) => b - a);

  console.log(cardId);
}