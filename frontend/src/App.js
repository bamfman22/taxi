// @flow

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import LoginSignup from './components/Login';
import Dashboard from './components/Dashboard';
import { currentUser } from './actions/UserActions.js';

import './App.css';

class App extends Component<Dispatch, {}> {
  constructor(props) {
    super(props);

    this.props.dispatch(currentUser());
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/login" render={props => <LoginSignup />} />
          <Route path="/signup" render={props => <LoginSignup signup />} />
          <Route path="/dashboard" component={Dashboard} />
        </div>
      </Router>
    );
  }
}

export default connect()(App);
