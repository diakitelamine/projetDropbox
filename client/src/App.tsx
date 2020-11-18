import React from 'react';
import logo from './logo.svg';
import './App.css';

import { HeaderBar } from './Components/HeaderBar';

// Conversion du Hook en classù
function App() {
  return (
    <div className="App">
      <HeaderBar.Display logo={()=>{ return (<div> <img src={'url'} alt=""/> </div>) }} menu={()=>{ return (<div>  </div>) }}  name={ <div>  </div> } />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
