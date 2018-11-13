// @flow

import React from 'react';
import { Card, Button, Icon } from 'antd';

class StandbyCard extends React.Component<{}, {}> {
  renderOffline() {
    return (
      <span>
        <h2>You're offline</h2>
        <Button type="primary">Go Online</Button>
      </span>
    );
  }

  renderOnline() {
    return (
      <span>
        <Icon
          type="alert"
          style={{ fontSize: 44 }}
          theme="twoTone"
          twoToneColor="#52c41a"
        />
        <h2 style={{ margin: '20px 0' }}>Finding Trips...</h2>
        <Button type="dashed">Go Offline</Button>
      </span>
    );
  }

  render() {
    return (
      <Card
        className="stand-by-card"
        title="Finding Trip"
        style={{ width: 500, textAlign: 'center' }}
      >
        {this.renderOnline()}
      </Card>
    );
  }
}

export default StandbyCard;
