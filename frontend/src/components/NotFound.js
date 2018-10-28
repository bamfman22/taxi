import React from 'react';
import { Layout } from 'antd';

import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

class NotFound extends React.Component {
  render() {
    return (
      <Layout className="layout">
        <Header />
        <Content
          style={{
            padding: '50px',
            backgroundColor: 'white',
            textAlign: 'center'
          }}
        >
          <h1>404 Not Found</h1>
        </Content>
        <Footer />
      </Layout>
    );
  }
}

export default NotFound;
