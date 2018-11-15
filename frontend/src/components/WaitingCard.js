// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Icon } from 'antd';

import type { Trip } from '../models';

class WaitingCard extends React.Component<{ trip: Trip }, {}> {
  render() {
    return (
      <Card
        title="Looking for nearby drivers"
        style={{ width: 500, textAlign: 'center' }}
      >
        <Icon type="loading-3-quarters" spin style={{ fontSize: 36 }} /> <br />
        <Button style={{ marginTop: 20 }} type="dashed">
          Request to Cancel
        </Button>
      </Card>
    );
  }
}

export default connect(({ user, trip }) => {
  return { trip };
})(WaitingCard);
