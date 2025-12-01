import { useState } from 'react';
//var initialValue = 0;

function App() {
  
  return(
  <div style ={{ textAlign: "center" }}>
   <Counter />  
  </div>
  )
}


function Counter(){
  const [count, setCount] = useState(0);
  return(
    <div>
    
     <h1>Count: {count}</h1>

    <button onClick={() => setCount(count+1)}>
      +
    </button>

    <button onClick={() => setCount(count-1)}>
      -
    </button>

    <button onClick={() => setCount(0)}>
      Reset
    </button>
    </div>
  )
}
function Dumb(){
  return(
    <p>I am a silly JSX component! I can be reused anywhere!</p>
  )
}
function Hello(){
  return <h1>Hello!</h1>
};

function Greeting(){
  return(
    <div>
      <h1>Hello, React!</h1>
      <p>This is JSX. It's like HTML... but javascript!!!</p>
    </div>
  )
}
//   const [count, setCount] = useState(0);

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Button Thingy</h1>
//       <p>You have clicked the button {count} times.</p>

//       <button
//         onClick={() => setCount(count + 1)}
//         style={{
//           padding: "12px 20px",
//           fontSize: "18px",
//           cursor: "pointer"
//         }}
//       >
//         Click Me
//       </button>
//       <button
//       onClick = {() => setCount(0)}
//            style={{
//           padding: "12px 20px",
//           fontSize: "18px",
//           cursor: "pointer"
//         }}>Reset</button>
//     </div>
//   );
// }

export default App;