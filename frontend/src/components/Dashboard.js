// @flow

/* global google */

import React from 'react';
import type { ElementRef } from 'react';
import type Dispatch from 'redux';
import { connect } from 'react-redux';

import Header from './Header';
import DashboardMap from './DashboardMap';
import PassengerCards from './PassengerCards';
import { apiRequest } from '../actions/UserActions';
import { updateTrip } from '../actions/TripActions';
import { SocketConnection } from '../websocket.js';
import type { Coordinate, Destination, User, Trip } from '../models.js';
import type LocationService from '../LocationService';

import './Dashboard.less';

const AIRPORT_PLACE_IDS = {
  sjc: 'ChIJm8Wz-sPLj4ARPn72bT9E-rw',
  sfo: 'ChIJVVVVVYx3j4ARP-3NGldc8qQ',
  oak: 'ChIJQabAAlSEj4ARYHQBAw8MY7A'
};

type DashboardState = {
  destination?: Destination,
  duration?: number,
  directions?: {
    request: {
      origin: {
        location: {
          lat: () => number,
          lng: () => number
        }
      },
      destination: {
        placeId: string
      }
    }
  }
};

type DashboardProps = {
  socket: SocketConnection,
  dispatch: Dispatch,
  user: User,
  trip: Trip,
  position: Coordinate,
  location_service: LocationService
};

class Dashboard extends React.Component<DashboardProps, DashboardState> {
  dirty: boolean = false;
  map: ElementRef<DashboardMap>;

  constructor(props: DashboardProps) {
    super(props);

    this.map = React.createRef();
    this.state = {};

    const self: any = this;
    self.fetchNagivation = this.fetchNagivation.bind(this);
    self.selectDestination = this.selectDestination.bind(this);
  }

  componentDidMount() {
    this.props.location_service.start();
  }

  componentWillUnmount() {
    this.props.location_service.stop();
  }

  distance(x: Coordinate, y: Coordinate) {
    const lat_delta = x.lat - y.lat;
    const lng_delta = x.lng - y.lng;

    return Math.sqrt(lat_delta * lat_delta + lng_delta * lng_delta);
  }

  fetchNagivation() {
    if (this.props.position == null || window.google == null) return;

    let dest;

    if (this.state.destination != null) {
      dest = this.state.destination;
    } else if (this.props.trip.destination != null) {
      dest = this.props.trip.destination;
    } else {
      return;
    }

    const origin = this.props.position;
    const destination = { placeId: AIRPORT_PLACE_IDS[dest] };

    if (this.state.directions != null) {
      const request = this.state.directions.request;
      const previous_origin = {
        lat: request.origin.location.lat(),
        lng: request.origin.location.lng()
      };
      const distance = this.distance(previous_origin, origin);
      const previous_place = request.destination.placeId;

      if (previous_place === destination.placeId && distance < 3e-4) {
        console.debug(
          'skipping refetching because distance change is low, change: ',
          distance
        );
        return;
      }
    }

    const direction = new google.maps.DirectionsService();

    direction.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date()
        }
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const route = result.routes[0].legs[0];

          console.log(result);
          console.log(route);

          this.setState({
            directions: result,
            duration: route.duration.value
          });
        } else {
          console.log('error when loading direction:', result);
        }
      }
    );
  }

  selectDestination(destination: Destination) {
    this.setState({ destination });
  }

  requestRide() {
    if (this.state.destination == null) return;

    const form = new FormData();
    form.append('destination', this.state.destination);

    apiRequest('POST', '/trip/create', form).then(resp =>
      this.props.dispatch(updateTrip(resp))
    );
  }

  getOtherPosition() {
    if (
      (this.props.trip.status === 'CREATED' ||
        this.props.trip.status === 'PICKING_UP') &&
      this.props.trip.location != null
    ) {
      if (this.props.user.role === 'passenger') {
        return this.props.trip.location.driver;
      } else {
        return this.props.trip.location.passenger;
      }
    }
  }

  renderCards() {
    if (this.props.user.role === 'passenger') {
      return (
        <PassengerCards
          duration={this.state.duration}
          onSelectDestination={this.selectDestination.bind(this)}
          onRequestRide={this.requestRide.bind(this)}
        />
      );
    }
    return <div />;
  }

  render() {
    this.fetchNagivation();

    return (
      <div>
        <Header dashboard />
        <div className="dashboard">
          <DashboardMap
            ref={this.map}
            className="google-map"
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAFnQKnBs2rcII3s9RvGLIJDQKgW6LJMrk&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            position={this.props.position}
            otherPosition={this.getOtherPosition()}
            directions={this.state.directions}
          />
        </div>
        <div className="dashboard-cards">{this.renderCards()}</div>
      </div>
    );
  }
}

export default connect(state => {
  return { user: state.user, trip: state.trip, position: state.location };
})(Dashboard);
