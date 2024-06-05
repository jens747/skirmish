// getLocalStorage, setLocalStorage, and setClick sourced from WDD330 Team Website project

import { resetTrainer } from "./gameLogic.mjs";
import { createSkireData, getHeroImg } from "./pokebank.mjs";
import newTrainer, { cpuTrainer, getRandCpu, setCpuLevel, getTrainerDeck, updateSkirmishCards } from "./trainer.mjs";

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
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

  let trainer;
  let cpuType;

  switch(action) {
    // Display welcom message
    case "welcomeTrainer":
      document.querySelector("#trainer-num").style.display = "none";
      document.querySelector("#trainer1Fieldset").style.display = "block";
      break;
    // Create new Trainer1, move to create trainer2 ()
    case "addTrainer1":
      // Check to see if trainer already exists
      if (getLocalStorage(input.value)) { 
        displayMessage(`${input.value} already exists. Please, log in or use a different name.`);
        break;
      }
      console.log("addTrainer1");
      // Display message to load trainer's profile
      displayMessage(`Generating ${input.value}'s profile.`);
      // Get name of Trainer1 & save to localStorage
      newTrainer(input.value);
      // Set the name of the trainer1 to local storage
      setupTrainers(input.value);
      // Get random Pokemon for Trainer1
      trainer = await createSkireData(10);
      // console.log(trainer);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCards(input.value, trainer);
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
      console.log("skirmish1");
      displayMessage("Single-player is not yet available.");

      // Check to see if trainer already exists
      if (getLocalStorage(input.value)) { 
        displayMessage(`${input.value} already exists. Please, log in or use a different name.`);
        break;
      }

      // CPU name determines cpu behavior
      cpuType = getRandCpu();

      // Save CPU to localStorage
      cpuTrainer(cpuType);
      // Set the name of the trainer1 to local storage
      setupTrainers(input.value);
      // Add CPU to current trainers
      addTrainer(cpuType);
      
      // Display message to load trainer's profile
      displayMessage(`Generating ${input.value}'s profile and CPU trainer.`);
      // Get random Pokemon for Trainer1
      trainer = await createSkireData(10);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCards(cpuType, trainer);
      
      // Hide trainer1Fieldset
      document.querySelector("#trainer1Fieldset").style.display = "none";
      // Show start-btn screen
      document.querySelector("#start-btn").style.display = "block";
      break;
    // Log-in Trainer1 & move to add Trainer2 (skirmish2)
    case "addTrainer1Login":
      console.log("addTrainer1Login");
      // Check for Trainer name
      if (getLocalStorage(input.value)) { 
        // Check if Trainer password matches provided password
        if (qs("#login1Pass").value === getLocalStorage(input.value).pass) {
          // Set the name of the trainer1 to current trainers
          setupTrainers(input.value);
          // Message user that their profile is loading
          displayMessage(`Loading ${input.value}'s profile.`);
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
      console.log("skirmish1Login");
      displayMessage("Single-player is not yet available.");
      
      // CPU name determines cpu behavior
      cpuType = getRandCpu();

      // Save CPU to localStorage
      console.log(cpuType);
      cpuTrainer(cpuType);
      // Set the name of the trainer1 to local storage
      setupTrainers(input.value);
      // Add CPU to current trainers
      addTrainer(cpuType);
      // Display message to load trainer's profile
      displayMessage(`Loading ${input.value}'s profile and generating CPU trainer.`);
      // Get random Pokemon for Trainer1
      trainer = await createSkireData(10);
      // Add Pokemon to Trainer1 profile
      await updateSkirmishCards(cpuType, trainer);

      // Change the cpu level to compete with user 
      await setCpuLevel(input.value, cpuType);

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
      // Check for empty input
      if (input.value === "") {
        displayMessage("Please enter a valid name.");
        break;
      }
      // Check to see if trainer already exists
      if (getLocalStorage(input.value)) { 
        displayMessage(`${input.value} already exists. Please, log in or use a different name.`);
        break;
      }
      console.log("skirmish2");
      // Display message to load trainer's profile
      displayMessage(`Generating ${input.value}'s profile.`);
      // Get name of Trainer2 & save to localStorage
      newTrainer(input.value);
      // Set the name of the trainer2 to local storage
      addTrainer(input.value);
      // Get random Pokemon for Trainer2
      trainer = await createSkireData(10);
      // Add Pokemon to Trainer2 profile
      updateSkirmishCards(input.value, trainer);
      document.querySelector("#trainer2Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
      break;
    case "skirmish2Login":
      console.log("skirmish2Login");
      // Check for Trainer name
      if (getLocalStorage(input.value)) { 
        // Check if Trainer password matches provided password
        if (qs("#login2Pass").value === getLocalStorage(input.value).pass) {
          // Set the name of the trainer2 to current trainers
          addTrainer(input.value);
          // Message user that their profile is loading
          displayMessage(`Loading ${input.value}'s profile.`);
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
      if (checkPass(input.value)) {
        document.querySelector("#winFieldset").style.display = "none";
        document.querySelectorAll(".regDiv")[0].style.display = "block";
        savePass(input.value, true);
      }
      break;
    case "regLossTrainer":
      if (checkPass(input.value)) {
        document.querySelector("#lossFieldset").style.display = "none";
        document.querySelectorAll(".regDiv")[0].style.display = "block";
        savePass(input.value, false);
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
    const trainers = getLocalStorage("currentTrainers");
    let trainerA = getLocalStorage(trainers[0]);
    let trainerB = getLocalStorage(trainers[1]);

    // Reset Trainer A current game stats
    trainerA = resetTrainer(trainers[0]);
    // trainerA.roundsWon = 0;
    // trainerA.roundsLost = 0;
    setLocalStorage(trainers[0], trainerA);
    // Reset Trainer B current game stats
    trainerB = resetTrainer(trainers[1]);
    // trainerB.roundsWon = 0;
    // trainerB.roundsLost = 0;
    setLocalStorage(trainers[1], trainerB);
    location.assign("../game/index.html");
    // location.assign("/skirmish/src/game/index.html");
  } catch (error) {
    console.error(`Error URL: bad ${error}`);
  }
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
export function savePass(pass, state) {
  // Set to winning or losing trainer depending on who is registering
  let trainer;
  state ? trainer = getWinner() : trainer = getLoser();
  // Get trainer's info from local storage
  const trainerInfo = getLocalStorage(trainer.name);
  // Update trainer's password
  trainerInfo.pass = pass;
  // Set trainer's info with updated password to localstorage
  setLocalStorage(trainer.name, trainerInfo);
}

// Get data for the winning player
export function getWinner() {
  // Get the names of the trainers from the current match
  const ct = getLocalStorage("currentTrainers");
  // Get the data for both trainers
  const t1 = getLocalStorage(ct[0]);
  const t2 = getLocalStorage(ct[1]);
  let winner;
  // Return the data of the trainer with the most wins
  (t1.roundsWon >= t2.roundsWon) ? winner = t1 : winner = t2;
  return winner;
}

// Get data for the losing player
export function getLoser() {
  // Get the names of the trainers from the current match
  const ct = getLocalStorage("currentTrainers");
  // Get the data for both trainers
  const t1 = getLocalStorage(ct[0]);
  const t2 = getLocalStorage(ct[1]);
  let loser;
  // Return the data of the trainer with the most losses
  (t1.roundsWon < t2.roundsWon) ? loser = t1 : loser = t2;
  return loser;
}

// Get data for a tie game
export function tieGame() {
  // Get the names of the trainers from the current match
  const ct = getLocalStorage("currentTrainers");
  // Get the data for both trainers
  const t1 = getLocalStorage(ct[0]);
  const t2 = getLocalStorage(ct[1]);
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
    console.log(audio);
  });

  console.log(callObj);
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