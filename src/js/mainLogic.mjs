import { loadAnimations, addActions, setClickAll, moveAndFadeImg, getLocalStorage } from "./utils.mjs";
import { catchRandPoke } from "./pokebank.mjs";

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
  let data = await catchRandPoke(10);
  // console.log(data);
  const localA = getLocalStorage("skireForTradeA");
  const localB = getLocalStorage("skireForTradeB");
  // Reset the Skiremon sold by the trader
  if (localA) { 
    // Show cards sold to winner
    data = localA
    // Clear cards sold to winner
    localStorage.removeItem("skireForTradeA");
    if (localB) { 
      // Clear cards sold to loser
      localStorage.removeItem("skireForTradeB") 
    }
  } 

  // Show cards sold to loser
  if (localB) { 
    data = localB
    // Clear cards sold to loser
    localStorage.removeItem("skireForTradeB");
  } 

  // const data = await catchRandPoke(10);
  await moveAndFadeImg(data);

  // data.map(dat => setPokeData(dat.poke));
  // const pokeTeam = await createSkireData(10);
  // console.log(pokeTeam);
}  