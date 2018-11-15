import List from 'antd/es/list';
import { Button } from 'antd';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { Link } from 'react-router-dom';
import Header from './Header';
import './Settings.css';

class Settings extends React.Component {
  render() {
    const data = [
      {
        title: 'Name',
        description: this.props.user.name
      },
      {
        title: 'Email',
        description: this.props.user.email
      },
      {
        title: 'Role',
        description: this.props.user.role
      },
      {
        title: 'Drivers License',
        description: this.props.user.license
      },
      {
        title: 'License Plate',
        description: 'none'
      },
      {
        title: 'Phone Number',
        description: this.props.user.phone
      }
    ];

    return (
      <div>
        <Header />
        <List
          className="list"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<a>{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
        <Button htmlType="submit">
          <Link to="/profile">Edit</Link>
        </Button>
        <Button htmlType="submit">
          <Link to="/">Back</Link>
        </Button>
      </div>
    );
  }
}

export default connect(state => {
  return { user: state.user };
})(Settings);
