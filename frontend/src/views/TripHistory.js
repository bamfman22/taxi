import React from 'react';
import { Layout, Card, Avatar, Icon } from 'antd';

import Header from '../components/Header';
import Footer from '../components/Footer';
import dots from '../assets/images/dots-2.svg';
import RoutePreview from '../assets/images/route-preview.png';
import DriverAvatar from '../assets/images/driver-avatar.png';

import './TripHistory.less';

const { Content } = Layout;

class TripHistory extends React.Component {
  renderCard() {
    return (
      <Card className="trip-card">
        <div className="route-preview">
          <img src={RoutePreview} alt="" />
        </div>
        <div className="trip-information">
          <div className="price">$11.74</div>
          <h1>Wednesday Night</h1>
          <div className="driver-information">
            <Avatar src={DriverAvatar} size="small" />
            <span className="name">Stepan Assonov</span>
          </div>
          <div className="car-information">
            <Icon
              type="car"
              theme="twoTone"
              style={{ fontSize: 24 }}
              twoToneColor="#2C90E9"
            />
            <span className="car-made">Toyota Prius 8PEM482</span>
          </div>
          <div className="origin-destination">
            <div className="dots" style={{ backgroundImage: `url(${dots})` }} />
            <div className="location-names">
              <div className="origin">1748 Sageland Dr, San Jose, CA</div>
              <div className="destination">
                San Jose International Airport, Terminal A
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  render() {
    return (
      <Layout>
        <Header />
        <Content style={{ width: 1280, margin: '40px auto' }}>
          <Content style={{ minHeight: '300px' }}>
            <h1>Trip History</h1>
            {[...Array(10)].map((x, i) => this.renderCard())}
          </Content>
        </Content>
        <Footer />
      </Layout>
    );
  }
}

export default TripHistory;
