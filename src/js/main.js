import { loadAnimations, addActions, setClickAll } from "./utils.mjs";
import { catchRandPoke, setPokeData, createSkireData } from "./pokebank.mjs";

// document.querySelector("#trainer-form").addEventListener("submit", function(event) {
//   event.preventDefault();
// });
document.forms["trainer-form"].addEventListener("submit", (e) => {
  console.log("submitted");
  // e.preventDefault();
  // e.target would contain our form in this case
  // checkoutProcess.checkout(e.target);
  try {
    location.assign("/game/index.html");
  } catch (error) {
    console.error(`Page not found: ${error}`);
  }
});

// const primeBtn = document.querySelectorAll(".prime-btn");

loadAnimations();
setClickAll(".prime-btn", addActions);
const data = await catchRandPoke(10);

data.map(dat => setPokeData(dat.poke));
const pokeTeam = await createSkireData(10);
console.log(pokeTeam);

