// @flow

import React from 'react';
import { connect } from 'react-redux';

import type { Trip } from '../models';
import StandbyCard from './StandbyCard';
import DriverPickingUpCard from './DriverPickingUpCard';
import DriverEnRouteCard from './DriverEnRouteCard';

type Props = {
  trip: Trip
};

class DriverCards extends React.Component<Props, {}> {
  render() {
    if (this.props.trip.status === 'PICKING_UP') {
      // picking up
      return <DriverPickingUpCard />;
    } else if (this.props.trip.status === 'EN_ROUTE') {
      // en route
      return <DriverEnRouteCard />;
    }
    // standby
    return <StandbyCard />;
  }
}

export default connect(({ user, trip }) => {
  return { user, trip };
})(DriverCards);
