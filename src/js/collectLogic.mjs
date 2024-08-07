import { qs, qsa, ce, getLocalStorage, setLocalStorage, setClick, setClickAll, displayMessage } from "./utils.mjs";
import { catchRandPoke, setSkireData, createSkireData } from "./pokebank.mjs";
import { searchDB, updateTrainerObj } from "../db/indexdb.js";

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

  // Add click listeners to sort buttons
  setClick("#collectAlphaAsc", sortCollection);
  setClick("#collectAlphaDesc", sortCollection);
  setClick("#collectIdAsc", sortCollection);
  setClick("#collectIdDesc", sortCollection);
  setClick("#collectLvAsc", sortCollection);
  setClick("#collectLvDesc", sortCollection);
  // Add click listener to export button
  setClick("#collectExport", exportTrainer);
  // Set list and grid button variables
  const listBtn = qs("#collectList");
  const gridBtn = qs("#collectGrid");

  // Add listeners to all elements
  setCollectListeners(listBtn, gridBtn);

  // Measures the screen when resized 
  window.addEventListener("resize", function() {
    let screenWidth = window.innerWidth;

    // Clicks gridBtn if screen is less than 656px
    if (screenWidth < 656) {
      gridBtn.click();
    }
  }); 

  // ***May not need URL
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
    // console.log(card);
    setSkireData(card, false);
  });
}

export async function setCollectListeners(listBtn, gridBtn) {
  
  const buySkireCard = qsa(".buySkireCard");
  const pokeCard = document.querySelectorAll(".poke-card");
  // const pokeCard = qsa(".poke-card");
  const skireCostDiv = qsa(".skireCostDiv");
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
      buySkireCard.forEach(elm => {
        elm.classList.add("listBuySkireCard");
      });
      pokeCard.forEach(elm => {
        elm.classList.add("listPoke-card");
      });
      skireCostDiv.forEach(elm => {
        elm.classList.add("listSkireCostDiv");
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
      buySkireCard.forEach(elm => {
        elm.classList.remove("listBuySkireCard");
      });
      pokeCard.forEach(elm => {
        elm.classList.remove("listPoke-card");
      });
      skireCostDiv.forEach(elm => {
        elm.classList.remove("listSkireCostDiv");
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

  setClickAll(".sellSkireBtn", sellSkireCard);
}

// Function used to sell skire cards from collection
export async function sellSkireCard(action, event) {
  // Get the name of trainer and their data
  const cname = getLocalStorage("collecting");
  const trainer = await searchDB(cname);

  // Get the element to change coin collection display
  const ccoins = qs("#cCoins");

  // Element to show card was sold
  const skireCardSold = event.target.offsetParent.parentElement.lastChild;
  // Element to show card was sold
  const skireCardSalesTag = event.target.offsetParent;
  // Id of card that was sold
  const skireCardName = skireCardSold.id;
  // Coin value of card being sold
  const skireCardValue = event.target.offsetParent.firstChild.lastChild.textContent;
  // Number of cards in deck, prevents sale of all cards
  const cardsInDeck = Object.keys(trainer.skirmishCards).length;

  // Can't sell if less than 10 cards
  if (cardsInDeck > 10) {
    // Prevent user from clicking sell button again
    skireCardSalesTag.style.display = "none";

    // Prevent user from accessing sold card again
    skireCardSold.classList.add("soldCard");
    skireCardSold.textContent = "Sold";

    // Remove card from current stats to prevent error
    Object.keys(trainer.currentGame).forEach(key => {
      // Cycle through w/l/d, remove matching skiremon
      trainer.currentGame[key] = trainer.currentGame[key].filter(skire => skire !== skireCardName);
    });

    // Update trainer coin value
    trainer.coins += Number(skireCardValue);
    
    // Delete skirmish card from trainer's deck
    delete trainer.skirmishCards[[skireCardName]];
    
    // Update the trainer in IndexedDB
    await updateTrainerObj(cname, trainer);

    // Tell the trainer that the card was sold
    displayMessage(`You sold ${skireCardName} for ${skireCardValue} coins.`);

    // Update user's coin value on collection page
    ccoins.textContent = trainer.coins;
  } else {
    displayMessage("You must have more than 10 cards in your deck to sell.");
  }
}

export async function sortAlpha() {
  // Get the name of the current trainer
  const trainerName = getLocalStorage("collecting");
  // Get the trainer's info
  const trainer = await searchDB(trainerName);
  // Select the list/grid buttons
  const listBtn = qs("#collectList");
  const gridBtn = qs("#collectGrid");
  // Select ascending sort button
  const ascBtn = qs("#collectAlphaAsc");
  // Select descending sort button
  const descBtn = qs("#collectAlphaDesc");
  // Select all cards
  const cards = qsa(".poke-card");
  // Array to contain sorted card objects
  let sortedCards = {};
  
  // Collect the Skiremon names from cards
  const cardName = Array.from(cards).map(card => card.children[3].textContent);

  if (this.id === "collectAlphaDesc") {
    // Sort the array numerically
    cardName.sort().reverse();
    descBtn.classList.add("sortOff");
    ascBtn.classList.remove("sortOff");
  } else {
    // Sort in descending order
    cardName.sort();
    ascBtn.classList.add("sortOff");
    descBtn.classList.remove("sortOff");
  }
  // Loop through the ordered array of card names
  cardName.forEach(name => {
    // Search Skiremon Cards for matching name
    for (let key in trainer.skirmishCards) {
      // If the card name matches the sorted name
      if(trainer.skirmishCards[key][key].name === name) {
        // Place card object in new array
        sortedCards[key] = trainer.skirmishCards[key];
        // Break out of loop to search for next card
        break;
      }
    }
  });
  // Clear existing cards from screen
  cards.forEach(card => { card.remove(); });

  // Iterate over sorted card object
  Object.values(sortedCards).map(card => {
    // Create new card from sorted list
    setSkireData(card, false);
  });

  // Add listeners to all elements
  setCollectListeners(listBtn, gridBtn);
}

export async function sortId() {
  // Get the name of the current trainer
  const name = getLocalStorage("collecting");
  // Get the trainer's info
  const trainer = await searchDB(name);
  // Select the list/grid buttons
  const listBtn = qs("#collectList");
  const gridBtn = qs("#collectGrid");
  // Select ascending sort button
  const ascBtn = qs("#collectIdAsc");
  // Select descending sort button
  const descBtn = qs("#collectIdDesc");
  // Select all cards
  const cards = qsa(".poke-card");
  // Array to contain sorted card objects
  let sortedCards = {};
  
  // map through the cards
  const cardId = Array.from(cards).map(card => {
    // Get the text from the tag
    let str = card.children[1].firstChild.textContent;

    // Split the string into an array
    let parts = str.split(" ");

    // Get the last element of the split array (id)
    return parseInt(parts[parts.length - 1], 10);
  });

  // Sort the array numerically
  if (this.id === "collectIdAsc") {
    // Sort in ascending order
    cardId.sort((a, b) => a - b);
    ascBtn.classList.add("sortOff");
    descBtn.classList.remove("sortOff");
  } else {
    // Sort in descending order
    cardId.sort((a, b) => b - a);
    descBtn.classList.add("sortOff");
    ascBtn.classList.remove("sortOff");
  }

  // Loop through the ordered array of card ids
  cardId.forEach(id => {
    // Search Skiremon Cards for matching id
    for (let key in trainer.skirmishCards) {
      // If the card id matches the sorted id
      if(trainer.skirmishCards[key][key].id === id) {
        // Place card object in new array
        sortedCards[key] = trainer.skirmishCards[key];
        // Break out of loop to search for next card
        break;
      }
    }
  });
  // Clear existing cards from screen
  cards.forEach(card => { card.remove(); });

  // Iterate over sorted card object
  Object.values(sortedCards).map(card => {
    // Create new card from sorted list
    setSkireData(card, false);
  });

  // Add listeners to all elements
  setCollectListeners(listBtn, gridBtn);
}

export async function sortCollection() {
  // Get the name of the current trainer
  const name = getLocalStorage("collecting");
  // Get the trainer's info
  const trainer = await searchDB(name);
  // Select the list/grid buttons
  const listBtn = qs("#collectList");
  const gridBtn = qs("#collectGrid");
  // Select all cards
  const cards = qsa(".poke-card");
  // Array to contain sorted card objects
  let sortedCards = {};
  // Setup variables for sorting buttons
  let ascBtn = "";
  let descBtn = "";
  // Get the id of the current button action
  const action = this.id;

  let attribute = "";

  let cardValue = [];
  let cardName = [];

  switch(action) {
    case "collectIdAsc":
    case "collectIdDesc":
      // Select ascending sort button
      ascBtn = qs("#collectIdAsc");
      // Select descending sort button
      descBtn = qs("#collectIdDesc");

      // map through the cards
      cardValue = Array.from(cards).map(card => {
        // Get the text from the tag
        let str = card.children[1].firstChild.textContent;

        // Split the string into an array
        let parts = str.split(" ");

        // Get the last element of the split array (id)
        return parseInt(parts[parts.length - 1], 10);
      });

      // Sort the array numerically
      if (this.id === "collectIdAsc") {
        // Sort in ascending order
        cardValue.sort((a, b) => a - b);
        ascBtn.classList.add("sortOff");
        descBtn.classList.remove("sortOff");
      } else {
        // Sort in descending order
        cardValue.sort((a, b) => b - a);
        descBtn.classList.add("sortOff");
        ascBtn.classList.remove("sortOff");
      }
      break;
    case "collectAlphaAsc":
    case "collectAlphaDesc":
      // Select ascending sort button
      ascBtn = qs("#collectAlphaAsc");
      // Select descending sort button
      descBtn = qs("#collectAlphaDesc");

      // Collect the Skiremon names from cards
      cardValue = Array.from(cards).map(card => card.children[3].textContent);

      if (this.id === "collectAlphaDesc") {
        // Sort the array numerically
        cardValue.sort().reverse();
        descBtn.classList.add("sortOff");
        ascBtn.classList.remove("sortOff");
      } else {
        // Sort in descending order
        cardValue.sort();
        ascBtn.classList.add("sortOff");
        descBtn.classList.remove("sortOff");
      }
      break;
    case "collectLvAsc":
    case "collectLvDesc":
      // Select ascending sort button
      ascBtn = qs("#collectLvAsc");
      // Select descending sort button
      descBtn = qs("#collectLvDesc");

      // map through the cards
      cardValue = Array.from(cards).map(card => {
        // Get the text from the tag
        let str = card.children[1].lastChild.textContent;

        // Split the string into an array
        let parts = str.split(" ");

        // Get the last element of the split array (level)
        return parseInt(parts[parts.length - 1], 10);
      });

      if (this.id === "collectLvDesc") {
        // Sort the array numerically
        cardValue.sort().reverse();
        descBtn.classList.add("sortOff");
        ascBtn.classList.remove("sortOff");
      } else {
        // Sort in descending order
        cardValue.sort();
        ascBtn.classList.add("sortOff");
        descBtn.classList.remove("sortOff");
      }
      break;
    default:
      console.error("Error: switch case not found.");
      break;
  }

  // Loop through the ordered array of card ids
  cardValue.forEach(val => {
    // Search Skiremon Cards for matching id
    for (let key in trainer.skirmishCards) {
      this.id === "collectAlphaAsc" || this.id === "collectAlphaDesc"
        ? attribute = trainer.skirmishCards[key][key].name
        : this.id === "collectIdAsc" || this.id === "collectIdDesc"
          ? attribute = trainer.skirmishCards[key][key].id
          : this.id === "collectLvAsc" || this.id === "collectLvDesc"
            ? attribute = trainer.skirmishCards[key][key].level
            : console.log("Can't find attribute.");
      // If the card id matches the sorted id
      if(attribute === val) {
        // Add card object to new array if unique
        if(!cardName.includes(key)) {
          cardName.push(key);
          // Place card object in new array
          sortedCards[key] = trainer.skirmishCards[key];
          // Break out of loop to search for next card
          break;
        }
      }
    }
  });
  
  // Clear existing cards from screen
  cards.forEach(card => { card.remove(); });

  // Iterate over sorted card object
  Object.values(sortedCards).map(card => {
    // Create new card from sorted list
    setSkireData(card, false);
  });

  // Add listeners to all elements
  setCollectListeners(listBtn, gridBtn);
}

// Exports trainer data from a different pc/browser
export async function exportTrainer() {
  // Get the name of the current trainer
  const name = getLocalStorage("collecting");
  // Get the trainer's info
  const trainer = await searchDB(name);
  // Parse data into JSON
  const trainerJson = JSON.stringify(trainer);
  // Create file with trainer's JSON data in downloads
  createFile(trainerJson, `${name}.json`, "application/json");
  // Saving trainer data message
  displayMessage("Downloading trainer data to files.");
}

// Function creates a file to transfer
export async function createFile(content, fileName, contentType) {
  // Create temporary anchor tag for download
  const aTag = ce("a");
  // Create Blob to store trainer data
  const file = new Blob([content], {type: contentType});
  // Temp url points to data like file on server
  const url = URL.createObjectURL(file);
  // Point anchor href at url
  aTag.href = url;
  // Set a-tag download attribute to filename
  aTag.download = fileName;
  // When downloaded the file is labeled w/filename
  aTag.click();
  // Delays cleanup until after download starts
  setTimeout(() => {
    // Clears memory being used for Blob URL
    window.URL.revokeObjectURL(url);  
  }, 0); 
}