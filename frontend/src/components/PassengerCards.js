// @flow

import React from 'react';
import { connect } from 'react-redux';

import type { Destination, User, Trip } from '../models';
import DestinationCard from './DestinationCard';
import AppointmentCard from './AppointmentCard';
import WaitingCard from './WaitingCard';
import PickingUpCard from './PickingUpCard';
import EnRouteCard from './EnRouteCard';

type Props = {
  user: User,
  trip: Trip,
  duration?: number,
  onSelectDestination: (destination: Destination) => void,
  onRequestRide: () => void
};

class PassengerCards extends React.Component<Props, {}> {
  renderStateCard() {
    if (this.props.trip.id == null) {
      return (
        <AppointmentCard
          duration={this.props.duration}
          onRequestRide={this.props.onRequestRide}
        />
      );
    } else if (this.props.trip.status === 'CREATED') {
      // waiting for assign
      return <WaitingCard />;
    } else if (this.props.trip.status === 'PICKING_UP') {
      // waiting for driver picking up
      return <PickingUpCard />;
    } else if (this.props.trip.status === 'EN_ROUTE') {
      // en route
      return <EnRouteCard />;
    }
    return <div />;
  }

  render() {
    return (
      <div>
        <DestinationCard onSelectDestination={this.props.onSelectDestination} />
        {this.renderStateCard()}
      </div>
    );
  }
}

export default connect(({ user, trip }) => {
  return { user, trip };
})(PassengerCards);
