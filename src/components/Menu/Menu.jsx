import React from 'react';

// This is one of our simplest components
// It doesn't have local state
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is

function Menu() {
  return (
    <div className="container">
      <input /> 
      <button>Join Room</button>
    </div>
  );
}

export default Menu;
