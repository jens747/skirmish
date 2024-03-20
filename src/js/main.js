import { loadAnimations, addActions, setClickAll } from "./utils.mjs";
import { catchRandPoke, setPokeData, storePokeData } from "./pokebank.mjs";

// document.querySelector("#trainer-form").addEventListener("submit", function(event) {
//   event.preventDefault();
// });

// const primeBtn = document.querySelectorAll(".prime-btn");

loadAnimations();
setClickAll(".prime-btn", addActions);
const data = await catchRandPoke(10);
// console.log(data);
data.map(dat => setPokeData(dat.poke));
const pokeTeam = await storePokeData(10);
console.log(pokeTeam);