// getLocalStorage, setLocalStorage, setClick, and getParam, renderWithTemplate, loadTemplate, loadHeaderFooter sourced from WDD330 Team Website project

import { storePokeData } from "./pokebank.mjs";
import newTrainer, { updateSkirmishCards } from "./trainer.mjs";

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  document.querySelector(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  document.querySelector(selector).addEventListener("click", callback);
}

export function setBlur(selector, callback) {
  document.querySelector(selector).addEventListener("blur", callback);
}

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

export function setClickAll(selector, callback) {
  const btns = document.querySelectorAll(selector);
  btns.forEach(btn => {
    btn.addEventListener("touchend", (event) => {
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

export async function addActions(action, event) {
  const buttonName = event.target.name;
  const input = document.querySelector(`.trainer-input[name="${buttonName}"]`);
  // const fieldset = button.closest(".modal-fieldset"); 
  // const input = fieldset.querySelector(".trainer-input");
  // const input = document.querySelector(button); 
  // const inputValue = input.value;
  let trainer;

  switch(action) {
    case "welcomeTrainer":
      document.querySelector("#trainer-num").style.display = "none";
      document.querySelector("#trainer1Fieldset").style.display = "block";
      break;
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
      trainer = await storePokeData(10);
      // console.log(trainer);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCards(input.value, trainer);
      // Hide Trainer1Fieldset
      document.querySelector("#trainer1Fieldset").style.display = "none";
      // Show Trainer2Fieldset
      document.querySelector("#trainer2Fieldset").style.display = "block";
      break;
    case "loginTrainer1":
      console.log("loginTrainer1");
      // Display message to load trainer's profile
      displayMessage(`Loading ${input.value}'s profile.`);
      // Set the name of the trainer1 to local storage
      setupTrainers(input.value);
      document.querySelector("#trainer1Fieldset").style.display = "none";
      document.querySelector("#login1Fieldset").style.display = "block";
      break;
    case "skirmish1":
      // Check to see if trainer already exists
      if (getLocalStorage(input.value)) { 
        displayMessage(`${input.value} already exists. Please, log in or use a different name.`);
        break;
      }
      console.log("skirmish1");
      document.querySelector("#trainer1Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
      break;
    case "addTrainer1Login":
      console.log("addTrainer1Login");
      // Display message to load trainer's profile
      displayMessage(`Generating ${input.value}'s profile.`);
      document.querySelector("#login1Fieldset").style.display = "none";
      document.querySelector("#trainer2Fieldset").style.display = "block";
      break;
    case "skirmish1Login":
      console.log("skirmish1Login");
      document.querySelector("#login1Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
      break;
    case "loginTrainer2":
      console.log("loginTrainer2");
      // Display message to load trainer's profile
      displayMessage(`Loading ${input.value}'s profile.`);
      // Set the name of the trainer2 to local storage
      addTrainer(input.value);
      document.querySelector("#trainer2Fieldset").style.display = "none";
      document.querySelector("#login2Fieldset").style.display = "block";
      break;
    case "skirmish2":
      // Check to see if trainer already exists
      if (getLocalStorage(input.value)) { 
        displayMessage(`${input.value} already exists. Please, log in or use a different name.`);
        break;
      }
      console.log("skirmish2");
      // Display message to load trainer's profile
      displayMessage(`Generating ${input.value}'s profile.`);
      // Get name of Trainer1 & save to localStorage
      newTrainer(input.value);
      // Set the name of the trainer2 to local storage
      addTrainer(input.value);
      // Get random Pokemon for Trainer1
      trainer = await storePokeData(10);
      // console.log(trainer);
      // Add Pokemon to Trainer1 profile
      updateSkirmishCards(input.value, trainer);
      document.querySelector("#trainer2Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
      break;
    case "skirmish2Login":
      console.log("skirmish2Login");
      // Display message to load trainer's profile
      displayMessage(`Loading ${input.value}'s profile.`);
      document.querySelector("#login2Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
      break;
    case "regWinTrainer":
      console.log(input.value);
      document.querySelector("#winFieldset").style.display = "none";
      document.querySelectorAll(".regDiv")[0].style.display = "block";
      console.log(getWinner);
      savePass(input.value, true);
      break;
    case "regLossTrainer":
      console.log(event.target);
      document.querySelector("#lossFieldset").style.display = "none";
      document.querySelectorAll(".regDiv")[0].style.display = "block";
      savePass(event.target, false);
      break;
    default:
      console.error(`Error: bad ${event}`);
      break;
  }
}

export function loadAnimations() {
  setTimeout(() => {
    throwBall();
  }, 3000);
  
  setTimeout(() => {
    document.querySelector("form").style.display = "block";
  }, 3200);
}

// Example function to apply riseOffscreen animation
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
  // return cards.slice(0, 5);
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

export function getWinner() {
  const ct = getLocalStorage("currentTrainers")
  const t1 = getLocalStorage(ct[0]);
  const t2 = getLocalStorage(ct[1]);
  let winner;

  (t1.wins >= t2.wins) ? winner = t1 : winner = t2;
  return winner;
}

export function getLoser() {
  const ct = getLocalStorage("currentTrainers")
  const t1 = getLocalStorage(ct[0]);
  const t2 = getLocalStorage(ct[1]);
  let loser;

  (t1.wins < t2.wins) ? loser = t1 : loser = t2;
  return loser;
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

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = await templateFn(data);
  parentElement.insertAdjacentHTML(position, htmlString);
  if (callback) {
    callback(data);
  }
}

function loadTemplate(path) {
  // wait what?  we are returning a new function? this is called currying and can be very helpful.
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
  };
}

export async function loadHeaderFooter() {
  // headerTemplate and footerTemplate remember path passed in when created 
  // The renderWithTemplate function is expecting a template function...if we sent it a string it would break, if we changed it to expect a string then it would become less flexible.
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");
  const headerEl = document.querySelector("#main-header");
  const footerEl = document.querySelector("#main-footer");
  renderWithTemplate(headerTemplateFn, headerEl);
  renderWithTemplate(footerTemplateFn, footerEl);
}
