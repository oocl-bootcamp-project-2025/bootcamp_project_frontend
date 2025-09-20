import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map';

function App() {
  return (
    <div className="App">
      <main style={{ padding: '1rem', maxWidth: 960, margin: '0 auto' }}>
        <h2>Map POC</h2>
        <Map />
      </main>
    </div>
  );
}

export default App;
