// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Button, Card, Modal } from 'antd';

import type { Trip, Coordinate } from '../models';
import { DestinationName } from '../models';
import { AIRPORT_PLACE_IDS } from '../constants';
import { finishTrip } from '../actions/TripActions';

type Props = {
  trip: Trip,
  location: Coordinate,
  dispatch: Dispatch
};

const WAZE_PLACE_IDS = {
  sfo: '37.61657703%2C-122.38440156',
  sjc: '37.36844610%2C-121.92766200',
  oak: '37.71246670%2C-122.21213650'
};

class DriverEnRouteCard extends React.Component<Props, {}> {
  _encodeUrlQueries(queries): string {
    return Object.entries(queries)
      .map(
        ([k, v]) =>
          typeof v === 'string' ? `${k}=${encodeURIComponent(v)}` : ''
      )
      .join('&');
  }
  openGoogleMaps() {
    const parameters = {
      origin: `${this.props.location.lat},${this.props.location.lng}`,
      destination: DestinationName[this.props.trip.destination],
      destination_place_id: AIRPORT_PLACE_IDS[this.props.trip.destination],
      travelmode: 'driving'
    };
    const encoded = this._encodeUrlQueries(parameters);

    window.open(`https://www.google.com/maps/dir/?api=1&${encoded}`);
  }

  openWaze() {
    window.open(
      `https://www.waze.com/ul?ll=${
        WAZE_PLACE_IDS[this.props.trip.destination]
      }&navigate=yes&zoom=17`
    );
  }

  openAppleMaps() {
    const parameters = {
      saddr: `${this.props.location.lat},${this.props.location.lng}`,
      daddr: DestinationName[this.props.trip.destination],
      dirflg: 'd'
    };
    const encoded = this._encodeUrlQueries(parameters);

    window.open(`http://maps.apple.com/?${encoded}`);
  }

  finishTrip() {
    Modal.confirm({
      title: 'Finishing the Trip',
      content: 'Only finish the trip after you dropped off the passenger.',
      okText: 'Finish',
      onOk: () => {
        this.props.dispatch(finishTrip(this.props.trip.id));
      }
    });
  }

  render() {
    return (
      <Card
        className="picking-up-card"
        title="Driving to"
        style={{ width: 500 }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: 20 }}>
          <strong style={{ color: '#4a90e2' }}>
            {DestinationName[this.props.trip.destination]}
          </strong>
        </h3>
        <Button.Group style={{ display: 'block', marginBottom: 20 }}>
          <Button
            onClick={this.openGoogleMaps.bind(this)}
            style={{ width: '33%' }}
          >
            Google Maps
          </Button>
          <Button onClick={this.openWaze.bind(this)} style={{ width: '34%' }}>
            Waze
          </Button>
          <Button
            onClick={this.openAppleMaps.bind(this)}
            style={{ width: '33%' }}
          >
            Apple Maps
          </Button>
        </Button.Group>
        <Button onClick={this.finishTrip.bind(this)} block type="primary">
          Finish Trip
        </Button>
      </Card>
    );
  }
}

export default connect(({ trip, location }) => {
  return { trip, location };
})(DriverEnRouteCard);
