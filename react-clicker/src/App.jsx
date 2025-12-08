import { useEffect, useState, useRef } from 'react';
//var initialValue = 0;

function App() {
  
  return(
  <div style ={{ textAlign: "center" }}>
    <Form />
  </div>
  )
}

function useCounter(initial = 0){
  const[count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const reset = () => setCount(initial);
  return { count, increment, reset};
}


function Form(){
  const inputRef = useRef();
  return(
    <div>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>
        Focus the input!
      </button>
    </div>
  )
}

function Counter(){
  const [count, setCount] = useState(0);
    /*useEffect(() => {
      document.title = `Count: ${count}`;
    console.log("Runs only once!");
  },[count]);*/

    useEffect(() => {
      alert("Welcome to my React Page!");
    },[]);

    useEffect(() =>{
      const id = setInterval(() => setCount(c => c + 1), 1000);
      return () => clearInterval(id);
    },[]);

  return(
    <div>
    
     <h1>Click Num: {count}</h1>

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
  const { count, increment, reset} = useCounter(10);

  return(
    <p>This is dumb!</p>
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