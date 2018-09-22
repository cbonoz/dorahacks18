import React, { Component } from 'react'
import logo from './assets/hype_logo_white.png'
import Landing from './components/Landing'
import Home from './components/Home'

import { BrowserRouter as Router, Route } from 'react-router-dom'


import './App.css';

class App extends Component {
  render() {

    const currentPath = window.location.pathname
    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className=" animated fadeIn delay-2s App-logo" alt="logo" />
          {currentPath === '/dashboard' && <h1 className="App-title ">Project Search</h1>}
        </header>

        <Router>
          <div>
            <Route exact path="/" component={Landing} />
            <Route path="/dashboard" component={Home} />
          </div>
        </Router>

      </div>
    );
  }
}

export default App;
