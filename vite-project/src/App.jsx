import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const addValue = () => {
    let random = Math.floor(Math.random() * 100) + 1;
    setCount(random);
  }

const subtractValue = () => {
    setCount(count - 1);
}

  return (
    <>
      <div>
        <h1>counter 🧮 </h1>
        <p>Value: {count}</p>
        <button onClick={addValue}>Add +</button><br/>
        <button onClick={subtractValue}>Subtract -</button>
      </div>
    </>
  );
}

export default App;
