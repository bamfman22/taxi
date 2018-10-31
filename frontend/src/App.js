// @flow

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';
import Activation from './components/Activation';
import TripHistory from './views/TripHistory';
import LoginSignup from './components/Login';
import { currentUser } from './actions/UserActions';

import './App.css';

class App extends Component<Dispatch, {}> {
  constructor(props) {
    super(props);

    this.props.dispatch(currentUser());
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" render={props => <LoginSignup />} />
          <Route path="/signup" render={props => <LoginSignup signup />} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/history" component={TripHistory} />
          <Route path="/activate/:token" component={Activation} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default connect()(App);
