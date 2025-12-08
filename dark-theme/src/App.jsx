import { useTheme } from "./useTheme";

// A simple component that displays the current theme
function ThemeDisplay() {
  // This automatically gives us { theme, toggleTheme }
  const { theme } = useTheme();

  return (
    <h2 style={{ marginTop: "30px" }}>
      Current Theme: {theme === "light" ? "🌞 Light" : "🌚 Dark"}
    </h2>
  );
}

// A button that toggles the theme using the same hook
function ThemeButton() {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "10px 20px",
        marginTop: "20px",
        cursor: "pointer",
      }}
    >
      Toggle Theme
    </button>
  );
}

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Custom Hook + Context Example</h1>

      <ThemeDisplay />
      <ThemeButton />
    </div>
  );
}

export default App;