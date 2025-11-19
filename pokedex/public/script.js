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

    function displayPokemon(pokemonList){
        const selectedName = document.getElementById('pokemonSelect').value;
        const display = document.getElementById('pokemonDisplay');

        if(!selectedName){
            display.innerHTML = '';
            return;
        }

        const chosen = pokemonList.find(p => p.name === selectedName);

        display.innerHTML = `
        <h2>${chosen.name}</h2>

        <strong>Type:</strong>
        <p>${chosen.type.join(', ')}</p>

        <strong>Abilities:</strong>
        <p>${chosen.abilities.join(', ')}</p>
        
        <strong>Stats:</strong>
        <ul>
            <li>HP: ${chosen.stats.hp}</li>
            <li>Attack: ${chosen.stats.attack}</li>
            <li>Defense: ${chosen.stats.defense}</li>
            <li>Speed: ${chosen.stats.speed}</li>
        </ul>
        `;
    }
    loadPokemon();
