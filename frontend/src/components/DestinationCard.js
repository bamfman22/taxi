// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Card, Select } from 'antd';

import type { Coordinate, Destination, Trip } from '../models';

import dots from '../assets/images/dots.svg';

const Option = Select.Option;

type Props = {
  location?: Coordinate,
  trip: Trip,
  onSelectDestination: (destination: Destination) => void
};

class DestinationCard extends React.Component<Props, {}> {
  render() {
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
            disabled
            value={
              this.props.location == null ? 'Locating...' : 'Current Location'
            }
          />
          <Select
            size="large"
            className="destination"
            placeholder="Destination"
            onChange={this.props.onSelectDestination}
            disabled={this.props.trip.id != null}
            value={this.props.trip.destination}
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
}

export default connect(({ location, trip }) => {
  return { location, trip };
})(DestinationCard);
