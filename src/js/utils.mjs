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
      console.log("addTrainer1");
      // Get name of Trainer1 & save to localStorage
      newTrainer(input.value);
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
      document.querySelector("#trainer1Fieldset").style.display = "none";
      document.querySelector("#login1Fieldset").style.display = "block";
      break;
    case "skirmish1":
      console.log("skirmish1");
      document.querySelector("#trainer1Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
      break;
    case "addTrainer1Login":
      console.log("addTrainer1Login");
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
      
      document.querySelector("#trainer2Fieldset").style.display = "none";
      document.querySelector("#login2Fieldset").style.display = "block";
      break;
    case "skirmish2":
      console.log("skirmish2");
      // Get name of Trainer1 & save to localStorage
      newTrainer(input.value);
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
      document.querySelector("#login2Fieldset").style.display = "none";
      document.querySelector("#start-btn").style.display = "block";
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