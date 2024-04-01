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

export async function storePokeData(idx) {
  // Get random pokemon data
  const pokeBag = catchRandPoke(idx);

  // Create Pokemon object for easy access of data
  const pokeObj = (await pokeBag).map(bag => ({
    [bag.poke.name]: {
      "name": bag.poke.name,
      "evolutions": bag.poke.forms.map(form => form.name),
      "id": bag.poke.id,
      "level": 1,
      "wins": 0, 
      "losses": 0,
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
      "sprites": bag.poke.sprites
    }
  }));
  // console.log(pokeObj);
  return pokeObj;
}

export async function setPokeData(data) {
  // Extracting the name, types, and stats
  const name = await data.name;
  // console.log(name);
  const types = await data.types.map(typeInfo => typeInfo.type.name);
  const stats = await data.stats.map(stat => ({
      name: stat.stat.name,
      value: stat.base_stat
  }));

  // Create the <section> element
  const section = document.createElement("section");
  section.className = "poke-card";

  // const heroImg = data.sprites.other.showdown.front_default;
  let heroImg = data.sprites.other.dream_world.front_default;

  if (heroImg === null) {
    heroImg = data.sprites.other.home.front_default;
  }

  // const main = document.querySelector("main");
  const picture = document.createElement("picture");
  section.appendChild(picture);
  // document.body.appendChild(picture);

  const imgDefault = document.createElement("img");
  // const imgDefault = document.createElement("source");
  // imgDefault.setAttribute("media", "min-width: 256px");
  imgDefault.setAttribute("src", heroImg);
  imgDefault.setAttribute("alt", `Image of a ${name}`);
  imgDefault.className = "pokeImg";
  picture.appendChild(imgDefault);

  // Create the <h2> element for the name
  const h2 = document.createElement("h2");
  h2.className = "poke-name";
  h2.textContent = name; // Use the `name` variable

  // Create the <p> element for the types
  const pTypes = document.createElement("p");
  pTypes.className = "poke-type";
  let typesList = "Types: "
  types.forEach((type, idx) => {
    (idx === types.length - 1) 
      ? typesList += `${type}`
      : typesList += `${type}, `;
  });
  pTypes.textContent = typesList;

  // Create the <p> element for the stats
  const pStats = document.createElement("p");
  pStats.className = "poke-stats";
  pStats.innerHTML = `Attack: ${stats[1].value}<br>Defense: ${stats[2].value}`; 

  // Append the <h2>, <p> for types, and <p> for stats to the <section>
  section.appendChild(h2);
  section.appendChild(pTypes);
  section.appendChild(pStats);

  // Append the <section> to the body or another container in the document
  const main = document.querySelector("main");
  main.appendChild(section); 

  // console.log(`Name: ${name}`);
  // console.log(`Types: ${types.join(", ")}`);
  // stats.forEach(stat => {
  //     console.log(`${stat.name}: ${stat.value}`);
  // });
}