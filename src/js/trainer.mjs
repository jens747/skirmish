import { getLocalStorage, setLocalStorage, renderWithTemplate, setClick, shuffleCards } from "./utils.mjs";

// Set up new trainers
export default async function newTrainer(name, pass = "secret") {
  const p = getLocalStorage(name.toLowerCase());
  // class Trainer {
  //   constructor(name, pass, wins, losses, coins, roundsWon, roundsLost, skirmishCards) {
  //     this.name = name;
  //     this.pass = pass;
  //     this.wins = wins;
  //     this.losses = losses;
  //     this.coins = coins;
  //     this.roundsWon = roundsWon;
  //     this.roundsLost = roundsLost;
  //     this.skirmishCards = skirmishCards;
  //   }


  // }
  try {
    if (!p || p.name === "") {
      setLocalStorage(name, {
        "name": name,
        "pass": pass,
        "wins": 0,
        "losses": 0,
        "draws": 0,
        "coins": 0, 
        "roundsWon": 0, 
        "roundsLost": 0, 
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

// Remove registration modal if user declines registration
function closeModal() {
  document.querySelector("#register-name").value = "declined";
  document.querySelector("#register-email").value = "declined@example.com";
  document.querySelector("#registered").click();
}

// Gets user input and saves to localStorage
function addTrainer() {
  const userName = document.querySelector("#trainer-name").value;
  
  setLocalStorage("trainers", {
    "name": userName
  });
}

// export function verifyRegistration() {
//   const thanksContainer = document.querySelector("#thanks-container");
//   thanksContainer.style.display = "flex";
//   thanksContainer.classList.add("trainer-fade");
//   thanksContainer.addEventListener("animationend", () => {
//     thanksContainer.style.display = "none";
//   });
// }

// Add event listeners to modal buttons
function newTrainerModal() {
  const modalParent = document.querySelector(".divider");
  const multi = false;
  
  renderWithTemplate(renderModal, modalParent, undefined, () => {
    // Add eventlisteners after modal is created
    setClick("#added", addTrainer);
    // setClick("#not-registered", closeModal);
  });
}

// Create registration modal
function renderModal() {
  return `
    <section class="trainer-modal">
      <form class="trainer-form">
        <fieldset id="trainer-num">
          <legend>Welcome to PokeSkirmish!</legend>
          <label class="trainer-label"
            ><span class="label-span">How many trainers are there? </span
            ><input type="text" id="trainer-name" name="name" autofocus required
          /></label>
        </fieldset>

        <fieldset>
          <legend>Account Registration</legend>
          <label class="trainer-label"
            ><span class="label-span">Name </span
            ><input type="text" id="trainer-name" name="name" autofocus required
          /></label>
        </fieldset>

        <button class="modal-btn" id="not-registered">No Thanks</button>
        <input type="submit" value="Start Game" class="modal-btn" id="start-game" />
      </form>
    </section>
  `;
}

// Show a half-transparent DIV to "shadow" the page
// (the form is not inside, but near it, because it shouldn't be half-transparent)
// function openNewsletter() {
//   let nlContainer = document.createElement("div");
//   nlContainer.id = "newsletter-container";

//   // make the page unscrollable while the modal form is open
//   document.body.style.overflowY = "hidden";

//   document.body.append(nlContainer);
//   nlContainer.style.display = "block";
// }

// function closeNewsletter() {
//   document.querySelector("#newsletter-container").remove();
//   document.body.style.overflowY = "";
// }

// // function showPrompt(callback) {
// function showPrompt() {
//   openNewsletter();
//   let form = document.querySelector(".newsletter-form");
//   let nlClose = document.querySelector("#newsletter-close");
//   let nlModal = document.querySelector(".newsletter-modal");
//   document.body.append(nlModal);
//   nlModal.style.display = "flex";

//   function complete(value) {
//     closeNewsletter();
//     nlModal.style.display = "none";
//     document.onkeydown = null;
//     // callback(value);
//     console.log(value);
//   }

//   form.onsubmit = function() {
//     addThanks();
    
//     let value = form.email.value;

//     if (value == "") return false; // ignore empty submit
  
//     setLocalStorage("newsletter", {
//       "email": value
//     });
//     complete(value);
//     return false;
//   };

//   nlClose.addEventListener("click", function() {
//     complete(null);
//   });

//   form.elements[1].focus();
// }

// const nlo = document.querySelector("#newsletter-open")

// nlo.onclick = function() {
//   nlo.style.display = "none";
//   showPrompt();
// };

// function addThanks() {
//   const mission = document.querySelector(".mission");

//   // Create a new div element
//   const thanks = document.createElement("section");
//   thanks.id = "thanks-container";

//   const nlThanks = document.createElement("div");
//   nlThanks.id = "newsletter-thanks";
//   nlThanks.textContent = "You're on the list!";

//   thanks.appendChild(nlThanks);

//   // Append the new div to the parent of mission
//   mission.parentNode.insertBefore(thanks, mission.nextSibling);
  
//   thanks.style.display = "block";
// }
