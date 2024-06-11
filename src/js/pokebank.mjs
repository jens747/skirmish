import { ce, getLocalStorage, setClick } from "./utils.mjs";
import { popCards } from "./gamelayout.mjs";

export async function fetchPokeData(pokeId, pokeCategory) {
  // Let the user know we are waiting for a response
  document.body.style.cursor = "progress";

  try {
      // Fetching data for the Pokémon by its ID or name
      const response = await fetch(`https://pokeapi.co/api/v2/${pokeCategory}/${pokeId}/`);
      // Handle error 400 response 
      if (!response.ok) {
        throw new Error(`No Pokemon data for listed id. Error: ${response.status}.`);
      }
      const data = await response.json();
      // console.log(data);

      return data;
  } catch (error) {
      return null;
      // console.error("Pokémon not found:", error);
  } finally {
    // When we have a response revert cursor to default
    document.body.style.cursor = "default";
  }
}

// Fetching details for random pokemon
export async function catchRandPoke(idx) {
  let pokeBag = [];
  for (let index = 1; index <= idx; index++) {
    let id = Math.floor(Math.random() * 1025) + 1;
    // console.log(id);

    // Fetches the Pokemon data for a random pokemon
    let pokeData = await fetchPokeData(id, "pokemon");

    // Delete extra pokemon sprite data
    delete pokeData.sprites.versions;
    
    // Get the Pokemon types
    let pokeTypes = pokeData.types;
    // Get the URLs for the Pokemon types, used to get strengths/weaknesses
    let pokeUrls = pokeTypes.map(poke => poke.type.url);
    // Extract the type ID from each type URL
    let urlData = pokeUrls.map(url => {
      // split the url using / as the delimiter
      let section = url.split("/");
      // collect only the URL ID number
      let urlId = section[section.length - 2];

      return urlId;
    });
    // Get the strengths/weaknesses for the Pokemon
    let typeData = urlData.map(num => fetchPokeData(num, "type"));

    let typeDamage;
    
    try {
      // When the Promise is returned...
      let typeIds = await Promise.all(typeData);
      // Return the strengths/weaknesses for each Pokemon
      typeIds.forEach(typeId => {
        typeDamage = typeId.damage_relations;
      });
    } catch (error) {
      // Or log the error if fetch fails
      console.error("Error fetching data:", error);
    }

    let evolutions, evolutionData;

    try {
      evolutions = await fetchPokeData(id, "evolution-chain");

      let chain = await evolutions.chain.evolves_to;
      evolutionData = await chain.map(evo => evo.species);

    } catch (error) {
      evolutions = [];
      // console.error("Cannot evolve:", error);
    }

    // Push the data into the current Poke object
    pokeBag.push({
        poke: pokeData,
        type: typeDamage,
        evolutions: evolutionData ? evolutionData : null
    });
  }
  // console.log(pokeBag[0].type);
  return pokeBag;
}

export async function createSkireData(idx) {
  // Get random pokemon data
  const pokeBag = catchRandPoke(idx);
  console.log(pokeBag);

  // Create Pokemon object for easy access of data
  const pokeObj = (await pokeBag).map(bag => ({
    [bag.poke.name]: {
      "name": bag.poke.name,
      "evolutions": bag.poke.forms.map(form => form.name),
      "cries": bag.poke.cries, 
      "forms": bag.poke.forms, 
      "moves": bag.poke.moves, 
      "id": bag.poke.id,
      "level": 1,
      "wins": 0, 
      "losses": 0,
      "levelUp": {},
      "draws": 0,
      "nextLevel": 1,
      "hp": bag.poke.stats[0].base_stat,
      "attack": bag.poke.stats[1].base_stat,
      "defense": bag.poke.stats[2].base_stat,
      "specialAttack": bag.poke.stats[3].base_stat,
      "specialDefense": bag.poke.stats[4].base_stat,
      "speed": bag.poke.stats[5].base_stat,
      "types": bag.poke.types.map(typeInfo => typeInfo.type.name),
      "doubleDamageTo": bag.type.double_damage_to.map(dmg => dmg.name),
      "doubleDamageFrom": bag.type.double_damage_from.map(dmg => dmg.name),
      "halfDamageTo": bag.type.half_damage_to.map(dmg => dmg.name),
      "halfDamageFrom": bag.type.half_damage_from.map(dmg => dmg.name),
      "noDamageTo": bag.type.no_damage_to.map(dmg => dmg.name),
      "noDamageFrom": bag.type.no_damage_from.map(dmg => dmg.name),
      "sprites": bag.poke.sprites, 
      "coinValue": Math.floor((bag.poke.stats[0].base_stat + bag.poke.stats[1].base_stat + bag.poke.stats[2].base_stat + bag.poke.stats[3].base_stat + bag.poke.stats[4].base_stat + bag.poke.stats[5].base_stat) / 6)
    }
  }));
  // console.log(pokeObj);
  return pokeObj;
}

// Create Skire cards to view in trades & collections
export async function setSkireData(data, trade = true) {
  // Getting the name of the skiremon
  const skireKey = Object.keys(data)[0];
  // Extracting the name, types, and stats
  const skiremon = data[skireKey];

  // Create the <section> element
  const section = document.createElement("section");
  section.className = "poke-card";

  if (trade) {
    const trading = getLocalStorage("trading");
    const trader = getLocalStorage(trading);
    
    // console.log(Object.keys(trader.skirmishCards));
    Object.keys(trader.skirmishCards).map(name => {
      // Hide the card if Trainer already has one
      if(name === skiremon.name) {
        // console.log(skiremon.name);
        // console.log(name);
        section.style.display = "none";
      }
    });
  } 

  // Create the price div for the skiremon cards
  const skireCostDiv = ce("div");
  skireCostDiv.className = "skireCostDiv";
  section.appendChild(skireCostDiv);

  // Create the div for the coin
  const skireCostCoin = ce("div");
  skireCostCoin.className = "skireCostCoin";
  skireCostCoin.textContent = "C";
  skireCostDiv.appendChild(skireCostCoin);

  // Create the p tag to show the card value
  const skireCostValue = ce("p");
  skireCostValue.className = "skireCostValue";
  skireCostValue.textContent = skiremon.coinValue;
  skireCostDiv.appendChild(skireCostValue);

  // Create the div for the id, type, & lv
  const skireDivTop1 = ce("div");
  skireDivTop1.className = "skireDivTop";
  section.appendChild(skireDivTop1);

  // p tag for skiremon id
  const skireId1 = ce("p");
  skireId1.className = "skireId";
  skireId1.textContent = `id: ${skiremon.id}`;
  skireDivTop1.appendChild(skireId1);

  // p tags for the skiremon's types
  skiremon.types.map(type => {
    const stt1 = ce("p");
    stt1.className = `skireTopType ${type}`;
    section.classList.add(`${type}Border`);
    stt1.textContent = `${type}`;
    skireDivTop1.appendChild(stt1);
  });

  // p tag for skiremon level
  const skireLevel1 = ce("p");
  skireLevel1.className = "skireLevel";
  skireLevel1.textContent = `Lv: ${skiremon.level}`;
  skireDivTop1.appendChild(skireLevel1);

  // Get the hero image
  // let heroImg = getHeroImg(data);
  let skire, heroImg;

  Object.values(data).map(value => {
    skire = value;
    heroImg = getHeroImg(value);
  });

  // const main = document.querySelector("main");
  const picture = document.createElement("picture");
  section.appendChild(picture);
  // document.body.appendChild(picture);

  const imgDefault = document.createElement("img");
  // const imgDefault = document.createElement("source");
  // imgDefault.setAttribute("media", "min-width: 256px");
  imgDefault.setAttribute("src", heroImg);
  imgDefault.setAttribute("alt", `Image of a ${skire.name}`);
  imgDefault.className = "pokeImg";
  picture.appendChild(imgDefault);

  // Add h3 tag for skiremon name
  const t1Name = ce("h3");
  t1Name.className = "skireName tick";
  // t1Name.id = "t1Name";
  t1Name.textContent = skiremon.name;
  section.appendChild(t1Name);

  if (!trade) {
    // Create a list for the skiremon record
    const skireRecord1 = ce("ul");
    skireRecord1.className = "skireRecord";
    section.appendChild(skireRecord1);

    // Add list item for wins
    const skireWins1 = ce("li");
    skireWins1.className = "skireWins";
    skireWins1.textContent = `W: ${skiremon.wins}`;
    skireRecord1.appendChild(skireWins1);

    // Add list item for losses
    const skireLosses1 = ce("li");
    skireLosses1.className = "skireLosses";
    skireLosses1.textContent = `L: ${skiremon.losses}`;
    skireRecord1.appendChild(skireLosses1);

    // Add list item for draws
    const skireDraws1 = ce("li");
    skireDraws1.className = "skireDraws";
    skireDraws1.textContent = `D: ${skiremon.draws}`;
    skireRecord1.appendChild(skireDraws1);

    // Add list item for next level
    const skireNext1 = ce("li");
    skireNext1.className = "skireNextLv";
    skireNext1.textContent = `L🠝: ${skiremon.nextLevel}`;
    skireRecord1.appendChild(skireNext1);

    // If not trading remove coin value
    skireCostDiv.style.display = "none";
  }

  // Create div for hp & dmg tags
  const skireLife1 = ce("div");
  skireLife1.className = "skireLife";
  section.appendChild(skireLife1);

  // Creat p & span tags for hp
  const skireHp1 = ce("p");
  skireHp1.className = "skireHp";
  skireHp1.textContent = `HP: `;
  skireLife1.appendChild(skireHp1);

  const skireHpSpan1 = ce("span");
  skireHpSpan1.className = "skireSpan spanHp";
  skireHpSpan1.textContent = `${skiremon.hp}`;
  skireHp1.appendChild(skireHpSpan1);

  // Create p & span tags for damage
  const skireDmg1 = ce("p");
  skireDmg1.className = "skireDmg";
  skireLife1.appendChild(skireDmg1);

  const skireDmgSpan1 = ce("span");
  skireDmgSpan1.className = "skireSpan spanDmg";
  // skireDmgSpan1.textContent = "";
  skireDmg1.appendChild(skireDmgSpan1);

  // Create p & span tags for speed
  const skireSpd1 = ce("p");
  skireSpd1.className = "skireSpd";
  skireSpd1.textContent = "Spd: ";
  skireLife1.appendChild(skireSpd1);

  const skireSpdSpan1 = ce("span");
  skireSpdSpan1.className = "skireSpan";
  skireSpdSpan1.textContent = `${skiremon.speed}`;
  skireSpd1.appendChild(skireSpdSpan1);

  // Create div for action buttons
  // const skireAction1 = ce("div");
  // skireAction1.className = "skireAction";
  // section.appendChild(skireAction1);

  // Create button for Attack action
  // const skireAtkBtn1 = ce("button");
  // skireAtkBtn1.className = "prime-btn skireAtkBtn";
  // skireAtkBtn1.id = "skireAtkBtn";
  // skireAtkBtn1.setAttribute("type", "button");
  // skireAtkBtn1.textContent = "Attack";
  // skireAction1.appendChild(skireAtkBtn1);

  // Create button for Sp. Attack action
  // const skireSpAtkBtn1 = ce("button");
  // skireSpAtkBtn1.className = "prime-btn skireSpAtkBtn";
  // skireSpAtkBtn1.id = "skireSpAtkBtn";
  // skireSpAtkBtn1.setAttribute("type", "button");
  // skireSpAtkBtn1.textContent = "Special";
  // skireAction1.appendChild(skireSpAtkBtn1);

  // Create div to show attack and sp. attack level
  const skireAtkTypes1 = ce("div");
  skireAtkTypes1.className = "skireAtkStats"
  section.appendChild(skireAtkTypes1);

  // Create Attack p tag
  const skireAtk1 = ce("p");
  skireAtk1.className = "skireAtk skireSpanStats";
  skireAtk1.textContent = "atk: ";
  skireAtkTypes1.appendChild(skireAtk1);

  // Create Attack span tag
  const skireAtkSpan1 = ce("span");
  skireAtkSpan1.className = "skireSpan skireSpanStats";
  skireAtkSpan1.textContent = `${skiremon.attack}`;
  skireAtk1.appendChild(skireAtkSpan1);

  // Create Special Attack p tag
  const skireSpAtk1 = ce("p");
  skireSpAtk1.className = "skireSpAtk skireSpanStats";
  skireSpAtk1.textContent = "sp. atk: ";
  skireAtkTypes1.appendChild(skireSpAtk1);

  // Create Special Attack span tag
  const skireSpAtkSpan1 = ce("span");
  skireSpAtkSpan1.className = "skireSpan skireSpanStats";
  skireSpAtkSpan1.textContent = `${skiremon.specialAttack}`;
  skireSpAtk1.appendChild(skireSpAtkSpan1);

  // Create div to show defense and sp. defense level
  const skireDefTypes1 = ce("div");
  skireDefTypes1.className = "skireDefStats"
  section.appendChild(skireDefTypes1);

  // Create Attack p tag
  const skireDef1 = ce("p");
  skireDef1.className = "skireDef skireSpanStats";
  skireDef1.textContent = "def: ";
  skireDefTypes1.appendChild(skireDef1);

  // Create Attack span tag
  const skireDefSpan1 = ce("span");
  skireDefSpan1.className = "skireSpan skireSpanStats";
  skireDefSpan1.textContent = `${skiremon.defense}`;
  skireDef1.appendChild(skireDefSpan1);

  // Create Special Attack p tag
  const skireSpDef1 = ce("p");
  skireSpDef1.className = "skireSpDef skireSpanStats";
  skireSpDef1.textContent = "sp. def: ";
  skireDefTypes1.appendChild(skireSpDef1);

  // Create Special Attack span tag
  const skireSpDefSpan1 = ce("span");
  skireSpDefSpan1.className = "skireSpan skireSpanStats";
  skireSpDefSpan1.textContent = `${skiremon.specialDefense}`;
  skireSpDef1.appendChild(skireSpDefSpan1);

  // Create div for the skiremon types
  const skireTypes1 = ce("div");
  skireTypes1.className = "skireCardTypes";
  section.appendChild(skireTypes1);

  // Create Strengths list
  const strongHeaders1 = ce("p");
  strongHeaders1.className = "skireHeaders";
  strongHeaders1.textContent = "Strong: ";
  skireTypes1.appendChild(strongHeaders1);

  // Create ul tag for Strengths list
  const skireStrength1 = ce("ul");
  skireStrength1.className = "skireStrength";
  skireTypes1.appendChild(skireStrength1);

  skiremon.doubleDamageTo.map(type => {
    const li1 = ce("li");
    skireStrength1.appendChild(li1);
    const stp1 = ce("p");
    stp1.className = `skireP ${type}`;
    stp1.textContent = `${type}`;
    li1.appendChild(stp1);
  });

  // Create Weaknesses list
  const weakHeaders1 = ce("p");
  weakHeaders1.className = "skireHeaders";
  weakHeaders1.textContent = "Weak: ";
  skireTypes1.appendChild(weakHeaders1);

  // Create ul tag for Weaknesses list
  const skireWeakness1 = ce("ul");
  skireWeakness1.className = "skireWeakness";
  skireTypes1.appendChild(skireWeakness1);

  skiremon.doubleDamageFrom.map(type => {
    const li1 = ce("li");
    skireWeakness1.appendChild(li1);
    const wtp1 = ce("p");
    wtp1.className = `skireP ${type}`;
    wtp1.textContent = `${type}`;
    li1.appendChild(wtp1);
  });

  const buyCard = ce("button");
  buyCard.className = "buySkireCard";
  buyCard.id = skiremon.name;
  buyCard.type = "button";
  buyCard.textContent = "bought";
  section.appendChild(buyCard);

  setStyleByType(skiremon, t1Name, section, "poke-card");

  // Create the <h2> element for the name
  // const h2 = document.createElement("h2");
  // h2.className = "poke-name";
  // h2.textContent = skire.name; // Use the `name` variable

  // Create the <p> element for the types
  // const pTypes = ce("p");
  // pTypes.className = "poke-type";
  // let typesList = "Types: "
  // skire.types.forEach((type, idx) => {
  //   (idx === skire.types.length - 1) 
  //     ? typesList += `${type}`
  //     : typesList += `${type}, `;
  // });
  // pTypes.textContent = typesList;

  // Create the <p> element for the stats
  // const pStats = document.createElement("p");
  // pStats.className = "poke-stats";
  // // pStats.innerHTML = `Attack: ${stats[1].value}<br>Defense: ${stats[2].value}`; 
  // pStats.innerHTML = `Attack: ${skire.attack}<br>Defense: ${skire.defense}`; 

  // Append the <h2>, <p> for types, and <p> for stats to the <section>
  // section.appendChild(h2);
  // section.appendChild(pTypes);
  // section.appendChild(pStats);

  // Append the <section> to the body or another container in the document
  const main = document.querySelector("main");
  main.appendChild(section); 

  // console.log(`Name: ${name}`);
  // console.log(`Types: ${types.join(", ")}`);
  // stats.forEach(stat => {
  //     console.log(`${stat.name}: ${stat.value}`);
  // });
}

export function getHeroImg(skiremon) {
  // const heroImg = data.sprites.other.showdown.front_default;
  let heroImg = skiremon.sprites.other.dream_world.front_default;

  if (heroImg === null) {
    heroImg = skiremon.sprites.other.home.front_default;
  }
  return heroImg;
}

export function setStyleByType(skiremon, t1Name, section, cardType) {
  let multiType;

  // p tags for the skiremon's types
  skiremon.types.map(type => {

    if (t1Name.classList.contains("tick")) {
      section.className = "";
      section.className = `${cardType} ${type}Border`;
      t1Name.classList.add(`${type}`);
      t1Name.classList.remove("tick");
    }

    if (multiType) {
      // section.classList.remove(`${type}Border`);
      section.className = "";
      section.className = `${cardType} ${type}Border`;
      // t1Name.classList.add(`${type}`);
      multiType = false;
    }

    multiType = true;
  });
}