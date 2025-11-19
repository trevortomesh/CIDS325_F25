const express = require("express");
//const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
//app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "./pokedex.json");
//const DEFAULT_PORT = 3000;
// const PORT = (() => {
//     const envPort = process.env.PORT;
//     if (!envPort) return DEFAULT_PORT;
//     const n = Number(envPort);
//     if (Number.isFinite(n) && n > 0) return n;
//     console.warn(`Invalid PORT "${envPort}". Falling back to ${DEFAULT_PORT}.`);
//     return DEFAULT_PORT;
// })();
// Function to safely load JSON data
function loadPokemonData() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading JSON:", err.message);
    return []; // Return empty array if file not found or invalid
  }
}

// GET all Pokémon
app.get("/pokemon", (req, res) => {
  const pokemon = loadPokemonData();
  res.json(pokemon);
});

// GET Pokémon by name
app.get("/pokemon/:name", (req, res) => {
  const pokemon = loadPokemonData();
  const found = pokemon.find(
    (p) => p.name.toLowerCase() === req.params.name.toLowerCase(),
  );
  if (!found) return res.status(404).send("Pokémon not found.");
  res.json(found);
});

// POST new Pokémon
app.post("/pokemon", (req, res) => {
  const pokemon = loadPokemonData();
  const newPokemon = req.body;

  if (!newPokemon.name || !newPokemon.type) {
    return res.status(400).send("Invalid Pokémon data.");
  }

  pokemon.push(newPokemon);
  fs.writeFileSync(DATA_FILE, JSON.stringify(pokemon, null, 2));
  res.status(201).json(newPokemon);
});

// Default route
app.get("/", (req, res) => {
  res.send("Pokémon API running. Visit /pokemon to see data.");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
// function startWithFallback(startPort, attempts = 10) {
//     const port = startPort;
//     console.log(`Starting server on port ${port}...`);
//     const server = app.listen(port, () => {
//         console.log(`Server running on http://localhost:${port}`);
//     });

//     server.on('error', (err) => {
//         if (err && err.code === 'EADDRINUSE' && attempts > 0) {
//             const nextPort = port + 1;
//             console.warn(`Port ${port} in use. Retrying on ${nextPort}...`);
//             setTimeout(() => startWithFallback(nextPort, attempts - 1), 150);
//         } else {
//             console.error('Failed to start server:', err && err.message ? err.message : err);
//         }
//     });
// }

// startWithFallback(PORT);
