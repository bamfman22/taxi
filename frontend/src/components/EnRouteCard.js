// @flow

import React from 'react';
import { Card } from 'antd';

class EnRouteCard extends React.Component<{}, {}> {
  render() {
    return (
      <Card
        className="en-route-card"
        title="En Route"
        style={{ width: 500, textAlign: 'center' }}
      >
        <h3>Estimated Time of Arrival: 00:00</h3>
      </Card>
    );
  }
}

export default EnRouteCard;
