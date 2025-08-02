const pokemonCardsContainer = document.getElementById('pokemonCards');
const searchInput = document.getElementById('searchInput');

let allPokemons = []; // Guardaremos los datos completos

// Función para obtener lista básica de los primeros 20 Pokémon
async function fetchPokemonList(limit = 20) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!res.ok) throw new Error('Error al obtener lista de Pokémon');
  const data = await res.json();
  return data.results; // [{name, url}, ...]
}

// Función para obtener datos completos de un Pokémon dado su URL
async function fetchPokemonData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener datos del Pokémon');
  return await res.json();
}

// Crear tarjeta con datos del Pokémon
function createPokemonCard(pokemon) {
  const div = document.createElement('div');
  div.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

  div.innerHTML = `
    <div class="card card-pokemon h-100 shadow-sm">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <p>
          <strong>Tipo:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}<br>
          <strong>Altura:</strong> ${pokemon.height / 10} m<br>
          <strong>Peso:</strong> ${pokemon.weight / 10} kg
        </p>
      </div>
    </div>
  `;

  return div;
}

// Mostrar todos los Pokémon en la página
function displayPokemons(pokemons) {
  pokemonCardsContainer.innerHTML = '';
  if (pokemons.length === 0) {
    pokemonCardsContainer.innerHTML = '<p class="text-center">No se encontraron Pokémon.</p>';
    return;
  }
  pokemons.forEach(pokemon => {
    const card = createPokemonCard(pokemon);
    pokemonCardsContainer.appendChild(card);
  });
}

// Filtrar Pokémon según búsqueda
function filterPokemons() {
  const filter = searchInput.value.toLowerCase();
  const filtered = allPokemons.filter(p => p.name.toLowerCase().includes(filter));
  displayPokemons(filtered);
}

// Cargar y mostrar Pokémon al iniciar
async function init() {
  try {
    pokemonCardsContainer.innerHTML = '<p class="text-center">Cargando Pokémon...</p>';
    const basicList = await fetchPokemonList(20);

    // Obtener datos completos
    const detailedList = await Promise.all(
      basicList.map(p => fetchPokemonData(p.url))
    );

    allPokemons = detailedList;
    displayPokemons(allPokemons);
  } catch (error) {
    pokemonCardsContainer.innerHTML = `<p class="text-danger text-center">${error.message}</p>`;
  }
}

searchInput.addEventListener('input', filterPokemons);

init();
