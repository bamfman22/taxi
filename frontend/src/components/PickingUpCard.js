// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Card } from 'antd';

import type { Driver, Trip } from '../models';

type Props = {
  trip: Trip
};

class PickingUpCard extends React.Component<Props, {}> {
  getInitial(name: string): string {
    const parts = name.split(' ');

    if (parts.length === 1) {
      return parts[0][0];
    }
    return parts[0][0] + parts.slice(-1)[0][0];
  }

  renderAvatar(driver: Driver) {
    const props = {
      size: 64
    };

    if (driver.profile_picture == null) {
      return <Avatar {...props}>{this.getInitial(driver.name)}</Avatar>;
    }

    return <Avatar src={driver.profile_picture} {...props} />;
  }

  render() {
    const driver = this.props.trip.driver;

    if (driver == null) {
      console.warn('this should not happen');
      return <div />;
    }

    return (
      <Card
        className="picking-up-card"
        title="Your driver is picking you up"
        style={{ width: 500 }}
      >
        {this.renderAvatar(driver)}
        <div className="driver-info">
          <span className="driver-name">{driver.name}</span>
          <span className="plate-number">
            <strong>{driver.plate}</strong> (Toyota Prius)
          </span>
        </div>
      </Card>
    );
  }
}

export default connect(({ trip }) => {
  return { trip };
})(PickingUpCard);
