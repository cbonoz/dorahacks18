import React, { Component } from 'react'
import logo from './assets/hype_logo_white_50.png'
import Landing from './components/Landing'
import Home from './components/Home'
import { Nav, Navbar, NavItem} from 'react-bootstrap'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import './App.css';

class App extends Component {
  render() {

    const currentPath = window.location.pathname
    return (
      <div className="App">

        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">
                <img
                  src={logo}
                  className=" animated fadeIn delay-2s App-logo"
                  alt="logo" />
              </a>

              {currentPath === '/dashboard' && <span className="App-title ">Blockchain Project Search</span>}
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav pullRight>
            <NavItem eventKey={1} href="/">
            Home
      </NavItem>
            <NavItem eventKey={2} href="/dashboard">
            Search Projects
      </NavItem>
          </Nav>
        </Navbar>

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
