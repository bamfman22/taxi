// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { message, Button, Card, Modal, Tooltip } from 'antd';

import { renderAvatar } from './common';
import type { Trip } from '../models';
import { pickUpTrip, notifyPassenger } from '../actions/TripActions';

type Props = {
  trip: Trip,
  dispatch: Dispatch
};

class DriverPickingUpCard extends React.Component<Props, {}> {
  pickedUpPassenger() {
    Modal.confirm({
      title: 'Starting the Trip',
      content: 'Please confirm that you have already picked up the passenger.',
      okText: 'Confirm',
      onOk: () => {
        this.props.dispatch(pickUpTrip(this.props.trip.id));
      }
    });
  }

  callPassenger() {
    if (this.props.trip.passenger.phone == null) return;

    window.open(`tel:${this.props.trip.passenger.phone}`);
  }

  notifyPassenger() {
    Modal.confirm({
      title: 'Notify the Passenger',
      content:
        'Notify the passenger to meet at the pick up location. Please only use this when you are close.',
      okText: 'Notify',
      onOk: () => {
        this.props.dispatch(notifyPassenger(this.props.trip.id)).then(() => {
          message.success('Passenger notified.');
        });
      }
    });
  }

  render() {
    const passenger = this.props.trip.passenger;

    return (
      <Card
        className="picking-up-card"
        title="Picking Up Passenger"
        style={{ width: 500 }}
      >
        {renderAvatar(passenger)}
        <div style={{ float: 'right', marginTop: 20 }}>
          <Button onClick={this.pickedUpPassenger.bind(this)} type="primary">
            Start the Trip
          </Button>
        </div>
        <div className="user-info">
          <span className="user-name">{passenger.name}</span>
          <span style={{ fontSize: 24, letterSpacing: '2em' }}>
            <Button.Group>
              <Tooltip placement="bottom" title="Call Passenger">
                <Button
                  icon="phone"
                  disabled={this.props.trip.passenger.phone == null}
                  onClick={this.callPassenger.bind(this)}
                />
              </Tooltip>
              <Tooltip placement="bottom" title="Notify Passenger">
                <Button
                  disabled={this.props.trip.notified}
                  onClick={this.notifyPassenger.bind(this)}
                  icon="bell"
                />
              </Tooltip>
            </Button.Group>
          </span>
        </div>
      </Card>
    );
  }
}

export default connect(({ trip }) => {
  return { trip };
})(DriverPickingUpCard);
