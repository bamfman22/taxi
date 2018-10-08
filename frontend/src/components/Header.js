import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import { logOut } from '../actions/UserActions.js';

import './Header.css';

const Header = props => {
  console.log(props);

  const userActions = props.user.name
    ? [
        <Menu.Item key="1">
          <Link to="/dashboard">{props.user.name}</Link>
        </Menu.Item>,
        <Menu.Item key="2" onClick={() => props.dispatch(logOut())}>
          Sign Out
        </Menu.Item>
      ]
    : [
        <Menu.Item key="1">
          <Link to="/login">Log In</Link>
        </Menu.Item>,
        <Menu.Item key="2">
          <Link to="/signup">Sign Up</Link>
        </Menu.Item>
      ];

  return (
    <Layout.Header>
      <div className="logo">
        <Link to="/">Taxi</Link>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectable={false}
        style={{ float: 'right', lineHeight: '64px' }}
      >
        {userActions}
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
    </Layout.Header>
  );
};

//export default Header;
export default connect(state => {
  return { user: state.user };
})(Header);
