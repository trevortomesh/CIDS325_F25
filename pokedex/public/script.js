/**
 * Frontend logic for the Pokedex app.
 * - Loads Pokémon from the API
 * - Renders a details card for the selected Pokémon
 * - Adds new Pokémon via the form
 * - Releases (deletes) a Pokémon from the list and server
 */

let pokemonList = [];

/**
 * Fetch the full list of Pokémon and populate the dropdown.
 * Also installs the change handler and binds the add form.
 */
async function loadPokemon() {
  const response = await fetch("/pokemon");
  const pokemon = await response.json();

  // Keep a global copy for later checks/updates
  pokemonList = pokemon;

  const select = document.getElementById("pokemonSelect");

  pokemonList.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.name;
    option.textContent = p.name;
    select.appendChild(option);
  });
  // Use the global list so new additions are reflected
  select.addEventListener("change", () => displayPokemon(pokemonList));
  bindForm();
}

/**
 * Render details for the currently selected Pokémon.
 * Also injects a Release button which triggers deletion.
 */
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
        <div style="margin-top:12px">
          <button id="releaseBtn" type="button" aria-label="Release ${chosen.name}">Release</button>
        </div>
        `;

  // Bind Release button after injecting it into the DOM
  const btn = document.getElementById("releaseBtn");
  if (btn) btn.addEventListener("click", () => releasePokemon(chosen.name));
}

/** Bind the Add Pokémon form and handle submit with validation. */
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
      msg.textContent = "Please provide a name.";
      msg.className = "error";
      return;
    }

    if (pokemonList.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      msg.textContent = "A Pokemon with this name already exists.";
      msg.className = "error";
      return;
    }

    const type = typeStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    // "Fire,,Dragon" => ["Fire","","Dragon"]
    const abilities = abilitiesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const stats = { hp, attack, defense, speed };

    const statValues = Object.values(stats);
    if (statValues.some((v) => !Number.isFinite(v) || v <= 0)) {
      msg.textContent = "Stats must be positive numbers!";
      msg.className = "error";
      return;
    }

    const payload = { name, type, abilities, stats };

    try {
      const res = await fetch("/pokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add Pokemon");
      }

      const created = await res.json();

      const select = document.getElementById("pokemonSelect");
      const option = document.createElement("option");

      pokemonList.push(created);
      option.value = created.name;
      option.textContent = created.name;
      select.appendChild(option);
      // Select the newly added Pokemon and display it
      select.value = created.name;
      displayPokemon(pokemonList);

      form.reset();
      msg.textContent = `Added ${created.name} successfully`;
      msg.className = "success";
    } catch (err) {
      msg.textContent = err.message || "Error loading Pokemon";
      msg.className = "error";
    }
  });
  form._bound = true;
}

/**
 * Release (delete) a Pokémon by name.
 * Confirms with the user, calls the API, and updates UI state.
 */
async function releasePokemon(name) {
  const msg = document.getElementById("message");
  const select = document.getElementById("pokemonSelect");
  const confirmRelease = window.confirm(`Release ${name}? This cannot be undone.`);
  if (!confirmRelease) return;

  try {
    let res = await fetch(`/pokemon/${encodeURIComponent(name)}`, { method: "DELETE" });
    if (!res.ok) {
      // Fallback: some environments/proxies block DELETE; try POST fallback route
      res = await fetch(`/pokemon/${encodeURIComponent(name)}/release`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to release Pokémon");
      }
    }

    // Remove a single matching entry from local list (in case of duplicates)
    const idx = pokemonList.findIndex((p) => p.name === name);
    if (idx !== -1) pokemonList.splice(idx, 1);

    // Remove from dropdown
    const opt = [...select.options].find((o) => o.value === name);
    if (opt) opt.remove();

    // Clear selection and display
    select.value = "";
    document.getElementById("pokemonDisplay").innerHTML = "";

    msg.textContent = `Released ${name}`;
    msg.className = "success";
  } catch (err) {
    msg.textContent = err.message || "Failed to release Pokémon";
    msg.className = "error";
  }
}

loadPokemon();
