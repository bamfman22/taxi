// @flow

import React from 'react';
import { Button, Card, Select } from 'antd';
import * as _ from 'lodash';

import Header from './Header';
import DashboardMap from './DashboardMap';
import dots from '../assets/images/dots.svg';
import taxi_icon from '../assets/images/taxi.svg';
import './Dashboard.less';

const Option = Select.Option;

const AIRPORT_PLACE_IDS = {
  sjc: 'ChIJm8Wz-sPLj4ARPn72bT9E-rw',
  sfo: 'ChIJVVVVVYx3j4ARP-3NGldc8qQ',
  oak: 'ChIJQabAAlSEj4ARYHQBAw8MY7A'
};

type Coordinate = {
  lat: number,
  lng: number
};

const destinations = {
  sfo: 'sfo',
  oak: 'oak',
  sjc: 'sjc'
};

type Destination = $Keys<typeof destinations>;

type DashboardState = {
  position: ?Coordinate,
  destination: ?Destination,
  duration: ?number,
  directions: ?any
};

class Dashboard extends React.Component<{}, DashboardState> {
  dirty: boolean = false;

  constructor(props: {}) {
    super(props);

    this.state = {
      position: null,
      duration: null,
      directions: null,
      destination: null
    };

    const self: any = this;
    self.successLocated = this.successLocated.bind(this);
    self.failedLocated = this.failedLocated.bind(this);
    self.fetchNagivation = this.fetchNagivation.bind(this);
    self.selectDestination = this.selectDestination.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.successLocated,
      this.failedLocated,
      {
        enableHighAccuracy: true,
        maximumAge: 100,
        timeout: Infinity
      }
    );
  }

  successLocated({ coords }: Position) {
    /* global google */
    this.setState(
      {
        position: {
          lat: coords.latitude,
          lng: coords.longitude
        }
      },
      this.fetchNagivation
    );
  }

  failedLocated() {}

  fetchNagivation() {
    if (this.state.position == null || this.state.destination == null) return;

    const destination = { placeId: AIRPORT_PLACE_IDS[this.state.destination] };
    const direction = new google.maps.DirectionsService();
    const origin = new google.maps.LatLng(
      this.state.position.lat,
      this.state.position.lng
    );

    direction.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date()
        }
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const route = result.routes[0].legs[0];

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
    this.setState({ destination }, this.fetchNagivation);
  }

  renderTime(time: Date) {
    if (time === undefined) {
      return;
    }

    return (
      <time>
        {_.padStart(time.getHours(), 2, '0')}:
        {_.padStart(time.getMinutes(), 2, '0')}
      </time>
    );
  }

  formatDuration(duration: number): string {
    console.log(duration);
    let result = '';

    const minutes = Math.floor((duration / 60) % 60);
    if (minutes !== 0) {
      result = `${minutes}m` + result;
    }

    // days
    const hours = Math.floor(duration / 60 / 60);
    if (hours !== 0) {
      result = `${hours}h` + result;
    }

    return result;
  }

  renderDestinationCard() {
    return (
      <Card
        title="Where do you want to go?"
        style={{ width: 500 }}
        className="origin-destination-card"
      >
        <div className="dots" style={{ backgroundImage: `url(${dots})` }} />

        <form className="form">
          <input
            className="origin"
            type="text"
            name="origin"
            placeholder="From"
            defaultValue="Current Location"
          />
          <Select
            size="large"
            className="destination"
            placeholder="Destination"
            onChange={this.selectDestination}
          >
            <Option value="sfo">San Francisco International Airport</Option>
            <Option value="sjc">
              Norman Y. Mineta San Jose International Airport
            </Option>
            <Option value="oak">Oakland International Airport</Option>
          </Select>
        </form>
      </Card>
    );
  }

  renderAppointmentCard() {
    if (this.state.duration == null) return;

    const origin_time = new Date();
    const arrival_time = new Date(origin_time.getTime());
    arrival_time.setSeconds(arrival_time.getSeconds() + this.state.duration);

    return (
      <Card
        title="What time do you want to leave?"
        className="appointment-card"
        actions={[<Button type="primary">Request a Ride</Button>]}
      >
        <div className="time-point">
          <strong>Departure</strong>
          {this.renderTime(origin_time)}
        </div>
        <span className="taxi-icon">
          <img src={taxi_icon} alt="taxi icon" />
          <span>
            {this.state.duration && this.formatDuration(this.state.duration)}
          </span>
        </span>
        <div className="time-point">
          <strong>Arrival</strong>
          {this.renderTime(arrival_time)}
        </div>
      </Card>
    );
  }

  render() {
    return (
      <div>
        <Header dashboard />
        <div className="dashboard">
          <DashboardMap
            className="google-map"
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAFnQKnBs2rcII3s9RvGLIJDQKgW6LJMrk&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            position={this.state.position}
            directions={this.state.directions}
          />
        </div>
        <div className="dashboard-cards">
          {this.renderDestinationCard()}
          {this.renderAppointmentCard()}
        </div>
      </div>
    );
  }
}

export default Dashboard;
