import React from 'react';
import { Layout, Button } from 'antd';
import { withRouter } from 'react-router-dom';

import Header from './Header';

import './Home.css';
import banner from '../assets/images/banner.jpg';

const { Content, Footer } = Layout;

const Home = props => (
  <Layout className="layout">
    <Header />
    <Content>
      <div
        className="banner"
        style={{
          minHeight: '85vh',
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          padding: 100
        }}
      >
        <h2 style={{ fontWeight: 600, marginTop: '15%' }}>I am a big slogan</h2>
        <h3>and I am a smaller slogan</h3>
        <Button
          type="primary"
          size="large"
          style={{ marginTop: 50 }}
          onClick={() => props.history.push('/signup')}
        >
          Sign Up Now
        </Button>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center', paddingBottom: 100, paddingTop: 60 }}>
      SJSU CS160 Taxi &copy; 2018
    </Footer>
  </Layout>
);

export default withRouter(Home);
