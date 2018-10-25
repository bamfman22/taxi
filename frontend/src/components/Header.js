import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import { logOut } from '../actions/UserActions.js';

import './Header.css';

class Header extends React.Component {
  renderUserActions() {
    if (this.props.user.name !== undefined) {
      return [
        <Menu.Item key="1">
          <Link to="/dashboard">{this.props.user.name}</Link>
        </Menu.Item>,
        <Menu.Item key="2" onClick={() => this.props.dispatch(logOut())}>
          Sign Out
        </Menu.Item>
      ];
    }

    return [
      <Menu.Item key="1">
        <Link to="/login">Log In</Link>
      </Menu.Item>,
      <Menu.Item key="2">
        <Link to="/signup">Sign Up</Link>
      </Menu.Item>
    ];
  }

  renderMessages() {
    if (this.props.user.role === 'deactivated') {
      return (
        <div className="header-message warning">
          <div className="header-message-content">
            Please check your inbox to activate your account.
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    const dashboard = this.props.dashboard ? 'dashboard-header' : '';
    const theme = this.props.dashboard ? 'light' : 'dark';

    return (
      <Layout.Header className={dashboard}>
        <div className="logo">
          <Link to="/">Taxi</Link>
        </div>
        <Menu
          theme={theme}
          mode="horizontal"
          selectable={false}
          style={{ float: 'right', lineHeight: '64px' }}
        >
          {this.renderUserActions()}
        </Menu>
        <Menu
          theme={theme}
          mode="horizontal"
          selectable={false}
          style={{ float: 'left', lineHeight: '64px' }}
        >
          <Menu.Item key="1">Drive</Menu.Item>
          <Menu.Item key="2">Ride</Menu.Item>
        </Menu>
        {this.renderMessages()}
      </Layout.Header>
    );
  }
}

//export default Header;
export default connect(state => {
  return { user: state.user };
})(Header);
