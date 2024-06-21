import { loadAnimations, addActions, setClickAll, moveAndFadeImg, getLocalStorage, newSkirmish } from "./utils.mjs";
import { catchRandPoke } from "./pokebank.mjs";
import getIndexedDB from "../db/indexdb.js";

export default async function mainLogic() {
  // Starts the game when the event listener is triggered
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

  // Create a new IndexedDB database if none exists
  await getIndexedDB();

  // Get ready for a new game
  await newSkirmish(catchRandPoke);

}  