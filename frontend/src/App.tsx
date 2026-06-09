import React from 'react';
import SalonList from './components/SalonList';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header>
        <h1>Warsaw Salons Directory</h1>
        <p>Your best guide to beauty and hair salons in Warsaw</p>
      </header>
      
      <main>
        <SalonList />
      </main>
    </div>
  );
};

export default App;