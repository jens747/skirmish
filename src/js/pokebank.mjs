async function fetchPokemonData(pokemonId) {
  try {
      // Fetching data for the Pokémon by its ID or name
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
      const data = await response.json();
      console.log(data);

      // Extracting the name, types, and stats
      const name = data.name;
      const types = data.types.map(typeInfo => typeInfo.type.name);
      const stats = data.stats.map(stat => ({
          name: stat.stat.name,
          value: stat.base_stat
      }));
      console.log(types);

      // const heroImg = data.sprites.other.showdown.front_default;
      let heroImg = data.sprites.other.dream_world.front_default;

      if (heroImg === null) {
        heroImg = data.sprites.other.home.front_default;
      }

      // const main = document.querySelector("main");
      const picture = document.createElement("picture");
      // main.appendChild(picture);
      document.body.appendChild(picture);

      const imgDefault = document.createElement("img");
      // const imgDefault = document.createElement("source");
      // imgDefault.setAttribute("media", "min-width: 256px");
      imgDefault.setAttribute("src", heroImg);
      imgDefault.setAttribute("alt", `Image of a ${name}`);
      imgDefault.className = "pokeImg";
      picture.appendChild(imgDefault);

      // const pokeInfo = `
      //   <section class="poke-card">
      //     <h2 class="poke-name">${name}</h2>
      //     <p class="poke-type">${types}</p>
      //     <p class="poke-stats">${stats}</p>
      //   </section>
      // `;

      // main.appendChild(pokeInfo);

      // Create the <section> element
      const section = document.createElement("section");
      section.className = "poke-card";

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
      document.body.appendChild(section); 

      // console.log(`Name: ${name}`);
      // console.log(`Types: ${types.join(", ")}`);
      // stats.forEach(stat => {
      //     console.log(`${stat.name}: ${stat.value}`);
      // });
  } catch (error) {
      console.error("Pokémon not found:", error);
  }
}

// Fetching details for Pikachu
// fetchPokemonData("pikachu");
for (let index = 1; index <= 10; index++) {
  let id = Math.floor(Math.random() * 1025) + 1;
  console.log(id);
  fetchPokemonData(id);
}