import { qs, ce, isValid, getLocalStorage, setLocalStorage, setClickAll, displayMessage } from "./utils.mjs";
import { catchRandPoke, setSkireData, createSkireData } from "./pokebank.mjs";
import { searchDB, updateTrainerObj } from "../db/indexdb.js";

export default function tradeLoop() {
  // Get a selector for the back button
  const tradeBtn = qs("#tradesBack");
  // Add an eventListener to the back button
  tradeBtn.addEventListener("click", function() {
    window.history.back();
  });

  // Get the trades menu and trades
  getTradesMenu();

  
  const url = document.referrer;
  console.log(url);
  if (url.includes("endgame")) {
    getTrades("skireForTradeA");
  }

  if (url.includes("gameover")) {
    getTrades("skireForTradeB");
  }
}


// Get the skire available for trade in that round
export async function getTrades(skireStock) {
  let skireForTrade = getLocalStorage(skireStock);
  
  // If there are no skire in local storage
  if (!isValid(skireForTrade)) {
    // Get skire for trade
    skireForTrade = await createSkireData(10);
    // Remove any duplicates from the list
    skireForTrade = await getUniqueSkire(skireForTrade);
    // Set skire to localstorage
    await setLocalStorage(skireStock, skireForTrade);
  }
  // Display the Skire cards available for trade
  await skireForTrade.map(dat => setSkireData(dat));
  // const cardsToBuy = qs(".poke-card");
  window.addEventListener("load", function() {
    setClickAll(".buySkireCard", buySkireCard)
  });
  // pokeTeam.entries(poke => function() {
  //   console.log(poke[[poke]]);
  // });
}

export async function getTradesMenu() {
  // Get images for the shopkeeper
  const shopKeepImg = [
    "../img/femShopkeep1ChatGPTDall-E.webp",
    "../img/femShopkeep2ChatGPTDall-E.webp",
    "../img/femShopkeep3ChatGPTDall-E.webp",
    "../img/femShopkeep4ChatGPTDall-E.webp",
    "../img/femShopkeep5ChatGPTDall-E.webp",
    "../img/femShopkeep6ChatGPTDall-E.webp",
    "../img/maleShopkeep1ChatGPTDall-E.webp",
    "../img/maleShopkeep2ChatGPTDall-E.webp",
    "../img/maleShopkeep3ChatGPTDall-E.webp",
    "../img/maleShopkeep4ChatGPTDall-E.webp",
    "../img/maleShopkeep5ChatGPTDall-E.webp",
    "../img/maleShopkeep6ChatGPTDall-E.webp"
  ];
  const rand = Math.floor(Math.random() * (shopKeepImg.length - 1));

  // Get the name of the current trainer
  const trainer = getLocalStorage("trading");
  // Get the info of the current trainer
  // const trader = getLocalStorage(trainer);
  const trader = await searchDB(trainer);

  // Get the menu selector
  const tm = qs("#tradesMenu");

  // Get the coin value selector
  const tc = qs("#tCoins");
  tc.textContent = trader.coins;
  
  // Create the image for the shopkeeper
  const shopPic = ce("picture");
  const shopImg = ce("img");
  // Add src and alt attributes to image
  shopImg.setAttribute("src", shopKeepImg[rand]);
  shopImg.setAttribute("alt", "Image of a shopkeeper.");
  // Give image a class and append to picture
  shopImg.className = "shopkeeper";
  shopPic.appendChild(shopImg);

  // Create h1 menu title tag
  const th1 = ce("h1");
  th1.textContent = "Trade coins for Cards";
  th1.className = "tradesMenuH1";

  // Append h1 & picture tags to main
  tm.appendChild(shopPic);
  tm.appendChild(th1);
}

export async function buySkireCard(action, event) {
  const skireA = getLocalStorage("skireForTradeA");
  const skireB = getLocalStorage("skireForTradeB");
  // console.log(event.target);
  const targetSkire = action.target;
  const tname = getLocalStorage("trading");
  // const trainer = getLocalStorage(tname);
  const trainer = await searchDB(tname);
  let price;
  
  // console.log(trainer.coins);
  console.log(targetSkire);
  // Checking for match using forEach & hasOwnProperty
  skireA.forEach(skire => {
    if (Object.prototype.hasOwnProperty.call(skire, targetSkire.id)) {
      price = skire[targetSkire.id].coinValue;
      if (price <= trainer.coins) {
        makeTrade(targetSkire, skire, trainer, price);
        targetSkire.classList.add("boughtCard");
        targetSkire.disabled = true;
      } else {
        displayMessage("Not enough coins.");
      }
    }
  });
  // Checking for match using some & hasOwnProperty
  skireB.forEach(skire => {
    if (Object.prototype.hasOwnProperty.call(skire, targetSkire.id)) {
      price = skire[targetSkire.id].coinValue;
      if (price <= trainer.coins) {
        makeTrade(targetSkire, skire, trainer, price);
        targetSkire.classList.add("boughtCard");
        targetSkire.disabled = true;
        // console.log(skire[targetSkire.id].coinValue);
        // console.log(`${targetSkire.id} purchased`);
      } else {
        displayMessage("Not enough coins.");
      }
    }
  });
}

export async function makeTrade(target, skire, trainer, price) {
  // Get card name. Use as key to add to trainer object.
  const skireKey = target.id;
  // Get the trainer's skirmishCards.
  const skirmishCards = trainer.skirmishCards;
  // Get selector to show player's coin value
  const tCoins = qs("#tCoins");
  // Get selector to show cost of card bought
  const tCost = qs("#tCost");
  // Add the card to the trainer's cards.
  skirmishCards[skireKey] = skire;
  // Subtract the price from the trainer's coins.
  trainer.coins -= price;
  
  // Update player's coin value after buy
  tCoins.textContent = trainer.coins;
  tCost.textContent = -price;
  tCost.classList.add("showDmg");
  // Update the trainer cards and coins in storage.
  // setLocalStorage(trainer.name, trainer);
  updateTrainerObj(trainer.name, trainer);
}

export function getUniqueSkire(list) {
  // Used to Map through values to check for duplicates
  const uniqueSkireList = new Map();

  // Loop through the array of objects
  list.forEach(skireObj => {
      // Get the object name (key)
      const key = Object.keys(skireObj)[0];
      const skiremon = skireObj[key];
      
      // Use the skire id in Map to check uniqueness
      if (!uniqueSkireList.has(skiremon.id)) {
        // Add obj to set if duplicate is not found
          uniqueSkireList.set(skiremon.id, skireObj);  
      }
  });

  // Create an array from the set
  const uniqueSkiremon = Array.from(uniqueSkireList.values());

  // Return the list without duplicates
  return uniqueSkiremon;
}

export function restockSkiremon() {
  let skiremon;
  // Collect skiremon for trade from local storage
  const localA = getLocalStorage("skireForTradeA");
  const localB = getLocalStorage("skireForTradeB");
  // Reset the Skiremon sold by the trader
  if (localA) { 
    // Show cards sold to winner
    skiremon = localA
    // Clear cards sold to winner
    localStorage.removeItem("skireForTradeA");
    if (localB) { 
      // Clear cards sold to loser
      localStorage.removeItem("skireForTradeB") 
    }
  } 

  // Show cards sold to loser
  if (localB) { 
    skiremon = localB
    // Clear cards sold to loser
    localStorage.removeItem("skireForTradeB");
  } 

  return skiremon;
}