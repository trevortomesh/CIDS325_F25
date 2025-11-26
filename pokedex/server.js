// Simple Express server powering the Pokedex app.
// Responsibilities:
// - Serve static frontend files from /public
// - Provide a minimal JSON API to list, create, and delete Pokémon
// - Persist data to pokedex.json in the project root

const express = require("express");
// const cors = require("cors"); // Not needed when frontend is served by this server
const fs = require("fs");
const path = require("path");

const app = express();
// app.use(cors());
app.use(express.json()); // Parse application/json bodies
// Serve frontend assets without caching; resolve relative to this file to avoid CWD issues
const PUBLIC_DIR = path.join(__dirname, "public");
app.use(express.static(PUBLIC_DIR, { etag: false, lastModified: false, maxAge: 0 }));

// Simple API request logger to help debug issues like blocked methods
app.use((req, _res, next) => {
  if (req.path.startsWith("/pokemon")) {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
  }
  next();
});

const DATA_FILE = path.join(__dirname, "./pokedex.json");
// const PORT = 3000; // Uncomment to force a fixed port and disable the section below.

// Function to safely load JSON data from disk.
// Returns an empty array if the file is missing or invalid, so the API stays usable.
function loadPokemonData() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading JSON:", err.message);
    return []; // Return empty array if file not found or invalid
  }
}

// GET /pokemon — return an array of all Pokémon
app.get("/pokemon", (req, res) => {
  const pokemon = loadPokemonData();
  res.json(pokemon);
});

// GET /pokemon/:name — return a single Pokémon by (case-insensitive) name
app.get("/pokemon/:name", (req, res) => {
  const pokemon = loadPokemonData();
  const found = pokemon.find(
    (p) => p.name.toLowerCase() === req.params.name.toLowerCase(),
  );
  if (!found) return res.status(404).send("Pokémon not found.");
  res.json(found);
});

// POST /pokemon — create a new Pokémon
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

// DELETE /pokemon/:name — delete a Pokémon by (case-insensitive) name
app.delete("/pokemon/:name", (req, res) => {
  const name = String(req.params.name || "").toLowerCase();
  const pokemon = loadPokemonData();
  const index = pokemon.findIndex((p) => p.name.toLowerCase() === name);

  if (index === -1) return res.status(404).send("Pokémon not found.");

  const [removed] = pokemon.splice(index, 1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(pokemon, null, 2));
  res.json({ released: removed.name });
});

// Fallback for environments blocking DELETE: POST /pokemon/:name/release
app.post("/pokemon/:name/release", (req, res) => {
  const name = String(req.params.name || "").toLowerCase();
  const pokemon = loadPokemonData();
  const index = pokemon.findIndex((p) => p.name.toLowerCase() === name);

  if (index === -1) return res.status(404).send("Pokémon not found.");

  const [removed] = pokemon.splice(index, 1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(pokemon, null, 2));
  res.json({ released: removed.name, via: "fallback" });
});

// Convenience: Some environments might trigger a GET to this path.
// While state-changing GETs are not ideal, we support it here to avoid UX confusion.
app.get("/pokemon/:name/release", (req, res) => {
  const name = String(req.params.name || "").toLowerCase();
  const pokemon = loadPokemonData();
  const index = pokemon.findIndex((p) => p.name.toLowerCase() === name);

  if (index === -1) return res.status(404).send("Pokémon not found.");

  const [removed] = pokemon.splice(index, 1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(pokemon, null, 2));
  res.json({ released: removed.name, via: "get" });
});

// Default route — informational message for root path
app.get("/", (req, res) => {
  res.send("Pokémon API running. Visit /pokemon to see data.");
});

// ===== Simplified Port Handling (robust, no spinner) =====
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = "127.0.0.1"; // bind to localhost to avoid EPERM in restricted envs

function resolvePort() {
  const envPort = process.env.PORT;
  if (!envPort) return DEFAULT_PORT;
  const n = Number(envPort);
  // Accept 0 to request an ephemeral port from the OS
  if (Number.isFinite(n) && n >= 0) return n;
  console.warn(`Invalid PORT "${envPort}". Falling back to ${DEFAULT_PORT}.`);
  return DEFAULT_PORT;
}

const PORT = resolvePort();
const HOST = process.env.HOST || DEFAULT_HOST;

// Early visibility for where we intend to bind
console.log(`Starting server on ${HOST}:${PORT} ...`);

let server;
let bound = false; // Guard to prevent multiple concurrent starts
const MAX_RETRIES = 10;

// Try to bind to a port; on common errors (in-use, access) retry a few times.
function tryListen(port, attempt) {
  server = app.listen(port, HOST, () => {
    if (bound) return; // already started elsewhere
    bound = true;
    // Reflect the actual bound host/port (useful when PORT=0)
    const addr = server.address();
    let actualHost = HOST;
    let actualPort = port;
    if (addr && typeof addr === "object") {
      actualPort = addr.port;
      if (addr.address) actualHost = addr.address;
    }
    console.log(`Server running on http://${actualHost}:${actualPort}`);
  });

  server.once("error", (err) => {
    const code = err && err.code;
    if (bound) {
      // If we already started successfully, ignore later server errors here
      return;
    }
    if (code === "EADDRINUSE" && attempt < MAX_RETRIES) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use; retrying on ${nextPort}...`);
      try {
        server.close();
      } catch (_) {}
      return tryListen(nextPort, attempt + 1);
    }
    if ((code === "EACCES" || code === "EPERM") && attempt < MAX_RETRIES) {
      const nextPort = Math.max(3000, port + 1);
      console.warn(
        `Insufficient privileges to bind to ${HOST}:${port}; retrying on ${nextPort}...`,
      );
      try {
        server.close();
      } catch (_) {}
      return tryListen(nextPort, attempt + 1);
    }

    if (code === "EADDRINUSE") {
      console.error(
        `Port ${port} is in use. Set a different PORT env var or free the port.`,
      );
    } else if (code === "EACCES" || code === "EPERM") {
      console.error(
        `Insufficient privileges to bind to ${HOST}:${port}. Try a higher port or different HOST.`,
      );
    } else {
      console.error(
        "Failed to start server:",
        err && err.message ? err.message : err,
      );
    }
    // Exit so the process doesn’t appear to “hang”
    process.exit(1);
  });
}

tryListen(PORT, 0);

// Graceful shutdown to ensure the port is released
function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down...`);
  server.close((err) => {
    if (err) {
      console.error("Error during shutdown:", err.message || err);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
