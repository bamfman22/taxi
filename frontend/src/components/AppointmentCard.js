// @flow

import * as _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Card } from 'antd';

import type { DispatchProps } from '../models';

import taxi_icon from '../assets/images/taxi.svg';

type Props = {
  duration: ?number,
  onRequestRide: () => void
};

type State = {};

class AppointmentCard extends React.Component<Props & DispatchProps, State> {
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

  render() {
    if (this.props.duration == null) return <div />;

    const origin_time = new Date();
    const arrival_time = new Date(origin_time.getTime());
    arrival_time.setSeconds(arrival_time.getSeconds() + this.props.duration);

    return (
      <Card
        title="What time do you want to leave?"
        className="appointment-card"
        actions={[
          <Button type="primary" onClick={this.props.onRequestRide}>
            Request a Ride
          </Button>
        ]}
      >
        <div className="time-point">
          <strong>Departure</strong>
          {this.renderTime(origin_time)}
        </div>
        <span className="taxi-icon">
          <img src={taxi_icon} alt="" />
          <span>
            {this.props.duration && this.formatDuration(this.props.duration)}
          </span>
        </span>
        <div className="time-point">
          <strong>Arrival</strong>
          {this.renderTime(arrival_time)}
        </div>
      </Card>
    );
  }
}

export default connect(({ location }) => {
  return { location };
})(AppointmentCard);
