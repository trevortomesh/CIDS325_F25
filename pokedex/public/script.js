let pokemonList = [];

async function loadPokemon() {
  const response = await fetch("/pokemon");
  const pokemon = await response.json();

  const select = document.getElementById("pokemonSelect");

  pokemon.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.name;
    option.textContent = p.name;
    select.appendChild(option);
  });
  select.addEventListener("change", () => displayPokemon(pokemon));
  bindForm();
}

function displayPokemon(pokemonList) {
  const selectedName = document.getElementById("pokemonSelect").value;
  const display = document.getElementById("pokemonDisplay");

  if (!selectedName) {
    display.innerHTML = "";
    return;
  }

  const chosen = pokemonList.find((p) => p.name === selectedName);

  display.innerHTML = `
        <h2>${chosen.name}</h2>

        <strong>Type:</strong>
        <p>${chosen.type.join(", ")}</p>

        <strong>Abilities:</strong>
        <p>${chosen.abilities.join(", ")}</p>

        <strong>Stats:</strong>
        <ul>
            <li>HP: ${chosen.stats.hp}</li>
            <li>Attack: ${chosen.stats.attack}</li>
            <li>Defense: ${chosen.stats.defense}</li>
            <li>Speed: ${chosen.stats.speed}</li>
        </ul>
        `;
}

function bindForm() {
  const form = document.getElementById("addPokemonForm");
  const msg = document.getElementById("message");
  if (!form || form._bound) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    const name = document.getElementById("name").value.trim();
    const typeStr = document.getElementById("type").value.trim();
    const abilitiesStr = document.getElementById("abilities").value.trim();
    const hp = Number(document.getElementById("hp").value);
    const attack = Number(document.getElementById("attack").value);
    const defense = Number(document.getElementById("defense").value);
    const speed = Number(document.getElementById("speed").value);

    if (!name) {
      msg.textContent = 'Please provide a name.';
      msg.className = 'error';
      return;
    }

    if (pokemonList.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      msg.textContent = 'A Pokemon with this name already exists.';
      msg.className = 'error';
      return;
    }

    const type = typeStr.split(',').map(s => s.trim()).filter(Boolean);
    // "Fire,,Dragon" => ["Fire","","Dragon"]
    const abilities = abilitiesStr.split(',').map(s => s.trim()).filter(Boolean);
    const stats = { hp, attack, defense, speed };

    const statValues = Object.values(stats);
    if(statValues.some(v => !Number.isFinite(v) || v <= 0)){
      msg.textContent = 'Stats must be positive numbers!';
      msg.className = 'error';
      return;
    }

    const payload = { name, type, abilities, stats };

    try{
      const res = await fetch('/pokemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if(!res.ok){
        const text = await res.text();
        throw new Error(text || 'Failed to add Pokemon');
      }

      const created = await res.json();

    }

  });
}

loadPokemon();
