// -------------------------------------------------------------------
// THEME CONTEXT
// -------------------------------------------------------------------
// Context lets us share values with *any* component in the tree,
// without needing to pass props down manually at every level.
//
// This example stores:
//   - the current theme ("light" or "dark")
//   - a function to toggle the theme
//
// This file creates CONTEXT + PROVIDER only.
// The *custom hook* will be created separately.
// -------------------------------------------------------------------

import { createContext, useState } from "react";

// 1. Create an empty context object
export const ThemeContext = createContext();

// 2. Create a Provider component that wraps the entire app
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}