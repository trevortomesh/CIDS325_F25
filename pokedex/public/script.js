async function loadPokemon(){
    const response = await fetch('/pokemon');
    const pokemon = await response.json();

    const select = document.getElementById('pokemonSelect');

    pokemon.forEach(p =>{
        const option = document.createElement('option');
        option.value = p.name;
        option.textContent = p.name;
        select.appendChild(option);
    });

    select.addEventListener('change', () => displayPokemon(pokemon));

}