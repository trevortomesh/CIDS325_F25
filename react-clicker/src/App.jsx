import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React Button Clicker</h1>
      <p>You have clicked the button {count} times.</p>

      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: "12px 20px",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        Click Me
      </button>
      <button
      onClick = {() => setCount(0)}
           style={{
          padding: "12px 20px",
          fontSize: "18px",
          cursor: "pointer"
        }}>Reset</button>
    </div>
  );
}

export default App;