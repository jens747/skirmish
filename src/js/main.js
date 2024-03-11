async function fetchPokemonData(pokemonId) {
  try {
      // Fetching data for the Pokémon by its ID or name
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
      const data = await response.json();
      console.log(`PokeDex: ${data}`);

      // Extracting the name, types, and stats
      const name = data.name;
      const types = data.types.map(typeInfo => typeInfo.type.name);
      const stats = data.stats.map(stat => ({
          name: stat.stat.name,
          value: stat.base_stat
      }));

      console.log(`Name: ${name}`);
      console.log(`Types: ${types.join(", ")}`);
      stats.forEach(stat => {
          console.log(`${stat.name}: ${stat.value}`);
      });
  } catch (error) {
      console.error("Failed to fetch Pokémon data:", error);
  }
}

// Fetching details for Pikachu
fetchPokemonData("pikachu");