import React from 'react';
import { message, Layout, Button } from 'antd';
import { withRouter } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import { apiRequest } from '../actions/common';

const { Content } = Layout;

class Activation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: this.props.match.params.token,
      loaded: false
    };
  }

  componentDidMount() {
    this.fetchTokenStatus();
  }

  fetchTokenStatus() {
    apiRequest('GET', `/member/activate/${this.state.token}`).then(
      success => {
        this.setState({ loaded: true });
      },
      failed => {
        this.props.history.push('/404');
      }
    );
  }

  activate() {
    apiRequest('POST', `/member/activate/${this.state.token}`).then(
      success => {
        this.props.history.push('/');
      },
      failed => {
        message.error('Activate failed!');
      }
    );
  }

  renderContent() {
    return (
      <div>
        <Button type="primary" size="large" onClick={() => this.activate()}>
          Click here to verify your email address
        </Button>
      </div>
    );
  }

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
          {this.renderContent()}
        </Content>
        <Footer />
      </Layout>
    );
  }
}

export default withRouter(Activation);
