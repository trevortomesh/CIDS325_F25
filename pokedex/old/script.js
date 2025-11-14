fetch('pokedex.json')
    .then(response => {
        if(!response.ok){
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        window.pokedex = data;
        populateDropdown(data);
    })
    .catch(error =>{
        console.error('Error fetching Pokedex JSON:', error);
        document.getElementById('pokemon-details').textContent = "Failed to load Pokedex data.";

    });

    function populateDropdown(pokemonList){
        const select = document.getElementById('pokemon-select');
        pokemonList.forEach(pokemon => {
            const option = document.createElement('option');
            option.value = pokemon.name;
            option.textContent = pokemon.name;
            select.appendChild(option);
        });
    }

    function showPokemonDetails(pokemonName){
        const detailsDiv = document.getElementById('pokemon-details');
        const pokemon = window.pokedex.find(p => p.name === pokemonName);
        if(!pokemon){
            detailsDiv.innerHTML = "Pokemon Not Found!";
            return;
        }

        const types = pokemon.type.join(', ');
        const abilities = pokemon.abilities.join(', ');
        const stats = pokemon.stats;

        detailsDiv.innerHTML = `
        <h2>${pokemon.name}</h2>
        <p><strong>Type:</strong>${abilities}</p>
        <p><strong>Stats:</strong></p>
        <ul>
            <li>HP: ${stats.hp}</li>
            <li>Attack: ${stats.attack}</li>
            <li>Defense: ${stats.defense}</li>
            <li>Speed: ${stats.speed}</li>
        </ul>
        `;
    }

    document.getElementById('pokemon-select').addEventListener('change', function(){
        showPokemonDetails(this.value);
    });