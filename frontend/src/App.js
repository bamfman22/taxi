// @flow

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Profile from './components/Profile';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';
import Activation from './components/Activation';
import TripHistory from './views/TripHistory';
import LoginSignup from './components/Login';
import DriverSignup from './components/DriverSignup';
import { currentUser } from './actions/UserActions';
import { SocketConnection } from './websocket.js';
import LocationService from './LocationService';

import './App.css';
import Settings from './components/Settings';

class App extends Component<Dispatch, {}> {
  socket: SocketConnection;
  location_service: LocationService;

  constructor(props) {
    super(props);

    this.props.dispatch(currentUser());
    this.socket = new SocketConnection(this.props.dispatch);
    this.location_service = new LocationService(this.props.dispatch);
  }

  render() {
    const self = this;

    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" render={props => <LoginSignup />} />
          <Route path="/signup" render={props => <LoginSignup signup />} />
          <Route path="/driver/signup" component={DriverSignup} />
          <Route
            path="/dashboard"
            render={props => (
              <Dashboard
                socket={self.socket}
                location_service={self.location_service}
              />
            )}
          />
          <Route path="/history" component={TripHistory} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/activate/:token" component={Activation} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default connect()(App);
