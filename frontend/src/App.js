// @flow

import React, { Component } from 'react';
import { Layout, Menu, Button } from 'antd';
import './App.css';

import banner from './assets/images/banner.jpg';

const { Header, Content, Footer } = Layout;

console.log(banner);

class App extends Component<{}, {}> {
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">Taxi</div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false}
            style={{ float: 'right', lineHeight: '64px' }}
          >
            <Menu.Item key="1">Log In</Menu.Item>
            <Menu.Item key="2">Sign Up</Menu.Item>
          </Menu>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[]}
            selectable={false}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">Drive</Menu.Item>
            <Menu.Item key="2">Ride</Menu.Item>
          </Menu>
        </Header>
        <div
          className="banner"
          style={{
            minHeight: '85vh',
            backgroundImage: `url(${banner})`,
            backgroundSize: 'cover',
            padding: 100
          }}
        >
          <h2 style={{ fontWeight: 600, marginTop: '15%' }}>
            I am a big slogan
          </h2>
          <h3>and I am a smaller slogan</h3>
          <Button type="primary" size="large" style={{ marginTop: 50 }}>
            Sign Up Now
          </Button>
        </div>
        <Content style={{ padding: '0 50px' }} />
        <Footer
          style={{ textAlign: 'center', paddingBottom: 100, paddingTop: 60 }}
        >
          SJSU CS160 Taxi &copy; 2018
        </Footer>
      </Layout>
    );
  }
}

export default App;
