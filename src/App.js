import React, { Component } from 'react';
import './App.css';
import Dashboard from './views/Dashboard';

/* eslint class-methods-use-this: "off" */
class App extends Component {
  render() {
    return (
      <div className="App">
        <Dashboard />
      </div>
    );
  }
}

export default App;
