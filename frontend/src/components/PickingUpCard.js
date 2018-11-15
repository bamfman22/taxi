// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';

import type { Trip } from '../models';
import { renderAvatar } from './common';

type Props = {
  trip: Trip
};

class PickingUpCard extends React.Component<Props, {}> {
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
        {renderAvatar(driver)}
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
