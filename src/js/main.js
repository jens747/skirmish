import { loadAnimations, addActions, setClickAll, loadFooter } from "./utils.mjs";
// import { catchRandPoke, setPokeData, createSkireData } from "./pokebank.mjs";

// import { updateTime } from "./last-modified.mjs";

document.forms["trainer-form"].addEventListener("submit", (e) => {
  console.log("submitted");
  try {
    location.assign("/game/index.html");
  } catch (error) {
    console.error(`Page not found: ${error}`);
  }
});

loadAnimations();
setClickAll(".prime-btn", addActions);
// const data = await catchRandPoke(10);

// data.map(dat => setPokeData(dat.poke));
// const pokeTeam = await createSkireData(10);
// console.log(pokeTeam);

loadFooter();
// updateTime();