// getLocalStorage, setLocalStorage, and setClick sourced from WDD330 Team Website project

import { resetTrainer } from "./gameLogic.mjs";
import { catchRandPoke, createSkireData, getHeroImg } from "./pokebank.mjs";
import newTrainer, { cpuTrainer, getRandCpu, setCpuLevel, getTrainerDeck, updateSkirmishCards } from "./trainer.mjs";
import getIndexedDB, { updateSkirmishCardsObj, newTrainerObj, searchDB, deleteTrainerObj, updateTrainerObj } from "../db/indexdb";
import { restockSkiremon } from "./tradesLogic.mjs";

// retrieve data from localstorage
// export function getLocalStorage(key) {
//   let data;
//   JSON.parse(localStorage.getItem(key)) 
//     ? data = JSON.parse(localStorage.getItem(key)) 
//     : data = [];
//   return data;
// }
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  // If no data return empty set, otherwise parse data
  return data ? JSON.parse(data) : [];
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function rmLocalStorage(key) {
  localStorage.removeItem(key);
  console.log(`${key} deleted.`);
}

// variable is not an empty array, undefined, or null
export function isValid(variable) {
  return variable && Array.isArray(variable) ? variable.length > 0 : true;
}

// set a listener for touchend and click
export function setClick(selector, callback) {
  // document.querySelector(selector).addEventListener("touchend", (event) => {
  document.querySelector(selector).addEventListener("touchstart", (event) => {
    event.preventDefault();
    callback();
  });
  document.querySelector(selector).addEventListener("click", callback);
}

// remove event listeners for touchend and click
export function rmClick(selector, callback) {
  selector.removeEventListener("touchend", callback);
  selector.removeEventListener("click", callback);
}

// blur event listener
export function setBlur(selector, callback) {
  document.querySelector(selector).addEventListener("blur", callback);
}

// Display message if input field is empty
export function hasContent(trainerInput = ".trainer-input") {
  document.querySelectorAll(".trainer-input").forEach(input => {
    // Check if input field is empty
    if (!input) {
      // If there's an error message, prevent form submission
      // if (msg.textContent) {
      //   return false;
      // }

      // return true;
      displayMessage("Please fill out each field if you want to register.", 3000);
    }
  });
  // let msg = document.querySelector(message);
  // msg.textContent = "";
}

// Use to display a message onscreen
export function displayMessage(msg, time = 5000) {
  // Create the <section> element
  const msgsec = document.createElement("section");
  msgsec.className = "messageSection";

  const msgdiv = document.createElement("div");
  msgdiv.classname = "messageDiv";

  // Create the <p> element for the message
  const pmsg = document.createElement("p");
  pmsg.className = "message";
  pmsg.innerText = msg;

  // Append the <p> message to the <section>
  msgdiv.appendChild(pmsg);
  msgsec.appendChild(msgdiv);

  // Append the <section> to the body or another container in the document
  const bd = document.querySelector("body");
  bd.appendChild(msgsec); 

  // Wait for 5 seconds
  setTimeout(() => {
    // Apply the slide-up animation
    msgsec.style.animation = "disappear 0.5s forwards";
    
    // Wait for the animation to finish before removing the message
    msgsec.addEventListener("animationend", () => {
      msgsec.remove();
    });
  }, time);
}

// Add click eventListener to multiple tags
export function setClickAll(selector, callback) {
  const btns = document.querySelectorAll(selector);
  btns.forEach(btn => {
    // btn.addEventListener("touchend", (event) => {
    btn.addEventListener("touchstart", (event) => {
      event.preventDefault();
      const action = btn.getAttribute("data-action");
      callback(action, event);
    });
    btn.addEventListener("click", (event) => {
      const action = btn.getAttribute("data-action");
      callback(action, event);
    });
  });
}

// QuerySelector shorthand, returns matching element
export const qs = (selector, parent = document) => parent.querySelector(selector);

// QuerySelector shorthand, returns matching element
export const qsa = (selector, parent = document) => parent.querySelectorAll(selector);

// CreateElement shorthand, returns matching element
export const ce = (selector, parent = document) => parent.createElement(selector);

export function emptyObj(obj) {
  // Check if obj is null or undefined first
  if (obj == null) {
    return true; 
  }

  // Check if obj, array, or null
  if (typeof obj === "object" && !Array.isArray(obj)) {
      return Object.keys(obj).length === 0;
  }

  // Throw an error when obj is not an object
  throw new TypeError("Variable is not an object.");
}

// SetAttribute shorthand, returns matching element
// export const sa = (selector, parent = document) => parent.setAttribute(selector);

// Main menu actions
export async function addActions(action, event) {
  const buttonName = event.target.name;
  const input = document.querySelector(`.trainer-input[name="${buttonName}"]`);

  // getIndexedDB();

  let trainer;
  let cpuType;
  let name;
  let data;

  switch(action) {
    // Display welcom message
    case "welcomeTrainer":
      document.querySelector("#trainer-num").style.display = "none";
      document.querySelector("#trainer1Fieldset").style.display = "block";
      break;
    // Create new Trainer1, move to create trainer2 ()
    case "addTrainer1":
      // Set trainer name to lower case from input
      name = input.value.toLowerCase();
      data = await searchDB(name);

      // Check to see if trainer already exists
      if (data) {
        displayMessage(`${name} already exists. Please, log in or use a different name.`);
        break;
      } else {
        displayMessage(`Setting ${name}'s entry.`);
      }

      // Check to see if trainer already exists
      // if (getLocalStorage(name)) { 
      //   displayMessage(`${name} already exists. Please, log in or use a different name.`);
      //   break;
      // }

      console.log("addTrainer1");
      // Display message to load trainer's profile
      displayMessage(`Generating ${name}'s profile.`);
      // Get name of Trainer1 & save to localStorage
      // newTrainer(name);
      // Save name of Trainer1 to IndexedDB
      newTrainerObj(name);
      // Set the name of the trainer1 to local storage
      setupTrainers(name);
      // Get random Pokemon for Trainer1
      trainer = await createSkireData(10);
      // console.log(trainer);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCards(name, trainer);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCardsObj(name, trainer);
      // Hide Trainer1Fieldset
      document.querySelector("#trainer1Fieldset").style.display = "none";
      // Show Trainer2Fieldset
      document.querySelector("#trainer2Fieldset").style.display = "block";
      break;
    // Move to Trainer1 log in form (addTrainer1Login)
    case "loginTrainer1":
      console.log("loginTrainer1");
      document.querySelector("#trainer1Fieldset").style.display = "none";
      document.querySelector("#login1Fieldset").style.display = "block";
      break;
    // Move to start 1-player game from creating Trainer1
    case "skirmish1":
      // Set trainer name to lower case from input
      name = input.value.toLowerCase();
      console.log("skirmish1");
      // displayMessage("Single-player is not yet available.");

      // Check to see if trainer already exists
      // if (getLocalStorage(name)) { 
      //   displayMessage(`${name} already exists. Please, log in or use a different name.`);
      //   break;
      // }
      data = await searchDB(name);

      // Check to see if trainer already exists
      if (data) {
        displayMessage(`${name} already exists. Please, log in or use a different name.`);
        break;
      }

      // Get name of Trainer & save to localStorage
      // newTrainer(name);
      // Save name of Trainer1 to IndexedDB
      newTrainerObj(name);
      // Get random Pokemon for Trainer1
      trainer = await createSkireData(10);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCards(name, trainer);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCardsObj(name, trainer);

      // CPU name determines cpu behavior
      cpuType = getRandCpu();
      console.log(cpuType);
      // Save CPU to localStorage
      // cpuTrainer(cpuType);
      // Save CPU to Index Database
      newTrainerObj(cpuType);
      // Set the name of the trainer1 to local storage
      setupTrainers(name);
      // Add CPU to current trainers
      addTrainer(cpuType);
      
      // Display message to load trainer's profile
      displayMessage(`Generating ${name}'s profile and CPU trainer.`);
      // Get random Pokemon for Trainer1
      trainer = await createSkireData(10);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCards(cpuType, trainer);
      // Add Pokemon to Trainer1 profile
      await updateSkirmishCardsObj(cpuType, trainer);
      
      // Hide trainer1Fieldset
      document.querySelector("#trainer1Fieldset").style.display = "none";
      // Show start-btn screen
      document.querySelector("#start-btn").style.display = "block";
      break;
    // Log-in Trainer1 & move to add Trainer2 (skirmish2)
    case "addTrainer1Login":
      // Set trainer name to lower case from input
      name = input.value.toLowerCase();
      data = await searchDB(name);
      console.log("addTrainer1Login");
      // Check for Trainer name
      // if (getLocalStorage(name)) { 
      if (data) {
        // Check if Trainer password matches provided password
        // if (qs("#login1Pass").value === getLocalStorage(name).pass) {
        if (qs("#login1Pass").value === data.pass) {
          // Set the name of the trainer1 to current trainers
          setupTrainers(name);
          // Message user that their profile is loading
          displayMessage(`Loading ${name}'s profile.`);
          // Switch to display log in menu for trainer2
          document.querySelector("#login1Fieldset").style.display = "none";
          document.querySelector("#trainer2Fieldset").style.display = "block";
          break;
        } else {
          // Tell user if log in name or password are incorrect
          displayMessage("Invalid name or password. Please try again.");
          break;
        }
      } else {
        // Display message to load trainer's profile
        displayMessage("Enter your name & password to log-in.");
        break;
      }
    // Move to start 1-player game after Trainer1 logs in
    case "skirmish1Login":
      // Set trainer name to lower case from input
      name = input.value.toLowerCase();
      console.log("skirmish1Login");
      // displayMessage("Single-player is not yet available.");
      
      // CPU name determines cpu behavior
      cpuType = getRandCpu();

      // Save CPU to localStorage
      // console.log(cpuType);
      // cpuTrainer(cpuType);
      // Save CPU to Index Database
      newTrainerObj(cpuType);
      // Set the name of the trainer1 to local storage
      setupTrainers(name);
      // Add CPU to current trainers
      addTrainer(cpuType);
      // Display message to load trainer's profile
      displayMessage(`Loading ${name}'s profile and generating CPU trainer.`);
      // Get random Pokemon for Trainer1
      trainer = await createSkireData(10);
      // Add Pokemon to cpu profile
      await updateSkirmishCards(cpuType, trainer);
      // Add Pokemon to cpu profile
      await updateSkirmishCardsObj(cpuType, trainer);

      // Change the cpu level to compete with user 
      await setCpuLevel(name, cpuType);

      document.querySelector("#login1Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
      break;
    // Move to trainer 2 log in form (skirmish2Login)
    case "loginTrainer2":
      console.log("loginTrainer2");
      document.querySelector("#trainer2Fieldset").style.display = "none";
      document.querySelector("#login2Fieldset").style.display = "block";
      break;
    // Move to start 2-player game
    case "skirmish2":
      // Set trainer name to lower case from input
      name = input.value.toLowerCase();
      data = await searchDB(name);
      // Check for empty input
      if (name === "") {
        displayMessage("Please enter a valid name.");
        break;
      }
      // Check to see if trainer already exists
      // if (getLocalStorage(name)) { 
      console.log(data);
      if (data) {
        displayMessage(`${name} already exists. Please, log in or use a different name.`);
        break;
      }
      console.log("skirmish2");
      // Display message to load trainer's profile
      displayMessage(`Generating ${name}'s profile.`);
      // Get name of Trainer2 & save to localStorage
      // newTrainer(name);
      // Save name of Trainer2 to IndexedDB
      newTrainerObj(name);
      // Set the name of the trainer2 to local storage
      addTrainer(name);
      // Get random Pokemon for Trainer2
      trainer = await createSkireData(10);
      // Add Pokemon to Trainer2 profile
      updateSkirmishCards(name, trainer);
      // Add Pokemon to Trainer2 profile
      updateSkirmishCardsObj(name, trainer);
      document.querySelector("#trainer2Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
      break;
    case "skirmish2Login":
      // Set trainer name to lower case from input
      name = input.value.toLowerCase();
      data = await searchDB(name);
      console.log("skirmish2Login");
      // Check for Trainer name
      // if (getLocalStorage(name)) { 
      if (data) {
        // Check if Trainer password matches provided password
        // if (qs("#login2Pass").value === getLocalStorage(name).pass) {
        if (qs("#login2Pass").value === data.pass) {
          // Set the name of the trainer2 to current trainers
          addTrainer(name);
          // Message user that their profile is loading
          displayMessage(`Loading ${name}'s profile.`);
          // Switch to display log in menu for trainer2
          document.querySelector("#login2Fieldset").style.display = "none";
          document.querySelector("#start-btn").style.display = "block";
          break;
        } else {
          // Tell user if log in name or password are incorrect
          displayMessage("Invalid name or password. Please try again.");
          break;
        }
      } else {
        // Display message to load trainer's profile
        displayMessage("Enter your name & password to log-in.");
        break;
      }
    case "regWinTrainer":
      // If input meets pass requirements
      name = input.value;
      if (checkPass(name)) {
        // Hide registration fieldset 
        document.querySelector("#winFieldset").style.display = "none";
        document.querySelectorAll(".regDiv")[0].style.display = "block";
        savePass(name, true);
      }
      break;
    case "regLossTrainer":
      // If input meets pass requirements
      name = input.value;
      if (checkPass(name)) {
        // Hide registration fieldset
        document.querySelector("#lossFieldset").style.display = "none";
        document.querySelectorAll(".regDiv")[0].style.display = "block";
        savePass(name, false);
      }
      break;
    default:
      console.error(`Error: bad ${event}`);
      break;
  }
}

// If players choose to keep playing go back to the game screen
export function playAgain() {
  try {
    restockSkiremon();
    // const trainers = getLocalStorage("currentTrainers");
    // let trainerA = getLocalStorage(trainers[0]);
    // let trainerB = getLocalStorage(trainers[1]);

    // Reset Trainer A current game stats
    // trainerA = resetTrainer(trainers[0]);
    // setLocalStorage(trainers[0], trainerA);

    // Reset Trainer B current game stats
    // trainerB = resetTrainer(trainers[1]);
    // setLocalStorage(trainers[1], trainerB);

    location.assign("../game/index.html");
    // location.assign("/skirmish/src/game/index.html");
  } catch (error) {
    console.error(`Error URL: bad ${error}`);
  }
}

// If player chooses to return to main menu or new game
export async function newSkirmish(catchCallback) {
  // Check trainers, see if game has been played
  const trainers = getLocalStorage("currentTrainers");
  
  // If there are trainers or game has been played
  if(isValid(trainers)) {
    const t1 = await searchDB(trainers[0]);
    const t2 = await searchDB(trainers[1]);

    // Delete trainer data if they are temp accounts
    if(t1.pass === "secret") { await deleteTrainerObj(t1.name); }

    if(t2.pass === "secret") { await deleteTrainerObj(t2.name); }

    // Remove all items from localStorage
    rmLocalStorage("currentTrainers");
    rmLocalStorage("trading");
    rmLocalStorage("collecting");
    rmLocalStorage("winner");
    rmLocalStorage("loser");
  }

  // Search for CPU trainers
  const oak = await searchDB("prof oak");
  const elm = await searchDB("prof elm");

  // Delete CPU trainers if they are found
  if (oak) {
    await deleteTrainerObj("prof oak");
  }

  if (elm) {
    await deleteTrainerObj("prof elm");
  }

  // Get 10 random Skiremon to display on home page
  let data = restockSkiremon();
  
  if(!data || !isValid(data))
    data = await catchCallback(10);  

  // const data = await catchRandPoke(10);
  await moveAndFadeImg(data);
}

// Run ball logo rotate animation at main screen
export function loadAnimations() {
  setTimeout(() => {
    throwBall();
  }, 3000);
  
  setTimeout(() => {
    document.querySelector("form").style.display = "block";
  }, 3200);
}

// When the rotate animation ends throw the ball logo
function throwBall() {
  document.querySelectorAll(".bg").forEach(element => {
    // Remove previous animation styles if necessary
    element.style.animation = "throwBall .4s forwards";
    element.addEventListener("animationend", (e) => {
      if (e.animationName === "throwBall") {
        element.style.display = "none";
      }
    });
  });

  const form = document.querySelector("form");
  // form.style.display = "block";
  form.style.animation = "popForm .4s forwards";
}

// Display images of random Skiremon
export async function moveAndFadeImg(imgAr) {
  const imgBanner = qs("#imgBanner"); 
  const anime = [
    "randomMoveAndFadeE",
    "randomMoveAndFadeW",
    "randomMoveAndFadeSE",
    "randomMoveAndFadeNW",
    "randomMoveAndFadeSW",
    "randomMoveAndFadeNE"
  ];

  for (let i = 0; i < imgAr.length; i++) {
    const LIMIT = 8;
    const img = imgAr[i];
    let fadeImgURL, key;
    try {
      // Get images taken from API
      fadeImgURL = getHeroImg(img.poke);
    } catch (error) {
      // Catch the error without displaying it
      // console.log(error);
    } finally {
      // Get images from localstorage if able
      key = Object.keys(img)[0];
      
      fadeImgURL = getHeroImg(img[key]);
    }
     

    // Remove existing image if present
    if (imgBanner.firstChild) {
      imgBanner.removeChild(imgBanner.firstChild);
    }
    
    const rand = Math.floor(Math.random() * (anime.length));

    // Create new image element
    const skireImg = document.createElement("img");
    skireImg.src = fadeImgURL;
    
    try {
      // Use if images were taken from API
      skireImg.alt = `Image of a ${img.poke.name}`;
    } catch (error) {
      // Catch the error without displaying it
      // console.log(error);
    } finally {
      // Use if images were taken from localstorage
      skireImg.alt = `Image of a ${img[key].name}`;
    }
    skireImg.classList.add("mainSkireImg");
    skireImg.classList.add(`${anime[rand]}`); 
    imgBanner.appendChild(skireImg);

    if (i > LIMIT) { i = 0; }

    // Wait for a specific time before moving to the next image
    await new Promise(resolve => setTimeout(resolve, 3000)); 
  }
}

export function shuffleCards(cards) {
  // iterate through the array of values
  for (let idx = cards.length - 1; idx > 0; idx--) {
    // get a random number within the total value of cards
    let swap = Math.floor(Math.random() * (idx + 1));
    // swap the location of the cards based on their index and the random index
    [cards[idx], cards[swap]] = [cards[swap], cards[idx]];
  }
  // return the randomized deck
  return cards;
  // return cards.slice(0, 9);
}

// Check for real email
export function checkEmail(email) {
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return basicEmailRegex.test(email);
}

// Check password meets basic requirements
export function checkPass(pass) {
  const basicPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return basicPassRegex.test(pass);
}

// Saves the trainer's password
export async function savePass(pass, state) {
  // Set to winning or losing trainer depending on who is registering
  let trainer;
  state 
    ? trainer = await getWinner() 
    : trainer = await getLoser();
  // Get trainer's info from local storage
  // const trainerInfo = getLocalStorage(trainer.name);
  // Update trainer's password
  // trainerInfo.pass = pass;
  // Set trainer's info with updated password to localstorage
  // setLocalStorage(trainer.name, trainerInfo);
  await updateTrainerObj(trainer, pass, "pass");
}

// Get data for the winning player
export async function getWinner() {
  // Get the names of the trainers from the current match
  const ct = getLocalStorage("currentTrainers");
  // Get the data for both trainers
  // const t1 = getLocalStorage(ct[0]);
  // const t2 = getLocalStorage(ct[1]);
  const t1 = await searchDB(ct[0]);
  const t2 = await searchDB(ct[1]);
  let winner;
  // Return the data of the trainer with the most wins
  (t1.roundsWon >= t2.roundsWon) ? winner = t1 : winner = t2;
  setLocalStorage("winner", winner.name);
  return winner;
}

// Get data for the losing player
export async function getLoser() {
  // Get the names of the trainers from the current match
  const ct = getLocalStorage("currentTrainers");
  // Get the data for both trainers
  // const t1 = getLocalStorage(ct[0]);
  // const t2 = getLocalStorage(ct[1]);
  const t1 = await searchDB(ct[0]);
  const t2 = await searchDB(ct[1]);
  let loser;
  // Return the data of the trainer with the most losses
  (t1.roundsWon < t2.roundsWon) ? loser = t1 : loser = t2;
  setLocalStorage("loser", loser.name);
  return loser;
}

// Get data for a tie game
export async function tieGame() {
  // Get the names of the trainers from the current match
  const ct = getLocalStorage("currentTrainers");
  // Get the data for both trainers
  // const t1 = getLocalStorage(ct[0]);
  // const t2 = getLocalStorage(ct[1]);
  const t1 = await searchDB(ct[0]);
  const t2 = await searchDB(ct[1]);
  // Return true if there is a tie, else return false
  if (t1.wins === t2.wins) { return true; } 
  return false;
}

export function setupTrainers(trainer) {
  // Get the list of current trainers from local storage
  let ct = getLocalStorage("currentTrainers");
  // If the list does not exist
  if (!ct) {
    // Create an array for the list
    ct = new Array();
    // ...and add the first trainer to the list
    ct.push(trainer);
  } else {
    // If the list does exist, add the trainer to the first position
    ct[0] = trainer;
  }
  // Save updated list to localstorage
  setLocalStorage("currentTrainers", ct);
}

export function addTrainer(trainer) {
  // Get the list of current trainers from local storage
  let ct2 = getLocalStorage("currentTrainers");
  // Update current trainers list
  ct2[1] = trainer;
  // Save updated list to localstorage
  setLocalStorage("currentTrainers", ct2);
}

// Create a password hash with bcrypt.js
// https://github.com/dcodeIO/bcrypt.js
// Potential password hashing
// const bcrypt = require('bcrypt');

// export async function hashPass() {
//   const salt = await bcrypt.genSaltSync(10);
//   const hash = await bcrypt.hashSync(password, salt);
//   return hash;
// }

// *****Audio Functions*****
// Play sound effect
export function playSound(tag) {
  const sound = document.querySelector(tag);
  sound.play();
}

// Play sound effects in quick succession
export function playDoubleSound(selector) {
  let sound = document.querySelector(selector);
  if (!sound.paused) {
    // Reset the playback position
    sound.currentTime = 0; 
  }
  sound.play();
}

// Play audio for Skiremon calls
export function playCallAudio(callObj, name) {
  const callAudio = callObj[name];
  if (callAudio) {
      callAudio.play().catch(e => console.error("Failed to play audio:", e));
  } else {
      console.log("Call not found or not loaded");
  }
}

// Load audio for Skiremon calls
export function preloadCalls(t1Deck, t2Deck) {
  let callObj = {};

  fillObjFromDeck(t1Deck, callObj);
  fillObjFromDeck(t2Deck, callObj);

  Object.keys(callObj).forEach(key => {
    const audio = new Audio(callObj[key]);
    audio.preload = "auto";
    callObj[key] = audio; 
    // console.log(audio);
  });

  // console.log(callObj);
  return callObj;
}

export function fillObjFromDeck(deck, obj) {
  deck.forEach(key => {
      try {
          obj[key.name] = key.cries.latest;
      } catch (error) {
          // console.error(`No call available for ${key.name}: ${error}`);
      }
  });
}