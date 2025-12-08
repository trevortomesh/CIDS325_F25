import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProfileCard from './ProfileCard';

function App() {

  function handleHello(name){
    alert(`Hello from ${name}!`);
  }

  return(
    <div>
      <h1>Props Demo</h1>

      <ProfileCard
        name="Bob"
        occupation="Buildter"
        image="https://upload.wikimedia.org/wikipedia/en/c/c5/Bob_the_builder.jpg"
        onHello={handleHello}
        />
      
      <ProfileCard
        name="Spongebob"
        occupation="Fry Cook"
        image="https://static.wikitide.net/greatcharacterswiki/f/f9/Xfgfjbvdhbvjhsdb.png"
        onHello={handleHello}
      />

    </div>
  );
}

export default App
