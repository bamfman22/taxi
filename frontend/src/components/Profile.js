import React from 'react';
import './Profile.css';
import Header from './Header.js';
import connect from 'react-redux/es/connect/connect';
import { updateUser } from '../actions/UserActions';
import { Form, Select, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';

import traffic from '../assets/images/traffic.jpg';
import Col from 'antd/es/grid/col';

const FormItem = Form.Item;
const Option = Select.Option;

class Profile extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newUser = { name: values.name, role: values.role };
        updateUser(newUser);
        console.log('Received values of form: ', values);
        this.props.history.push('/');
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Header />
        <Col
          style={{
            backgroundImage: `url(${traffic})`,
            backgroundSize: 'cover',
            height: '50vh'
          }}
        />
        <FormItem label="Name" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please Enter Your Name' }]
          })(
            <Input
              placeholder={this.props.user.name}
              className={'name-class'}
            />
          )}
        </FormItem>
        <FormItem
          label="Email"
          value="nice"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please enter email',
                value: this.props.user.email
              }
            ]
          })(<Input placeholder={this.props.user.email} />)}
        </FormItem>
        <FormItem label="Role" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('role', {
            rules: [{ required: true, message: this.props.user.role }]
          })(
            <Select
              placeholder={this.props.user.role}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <Option value="Driver">Driver</Option>
              <Option value="Passenger">Passenger</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          label="Drivers License"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('license', {
            rules: [{ required: false, message: 'Drivers License' }]
          })(
            <Input
              placeholder={this.props.user.license}
              className={'name-class'}
            />
          )}
        </FormItem>
        <FormItem
          label="License Plate"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('plate', {
            rules: [{ required: false, message: 'license plate' }]
          })(
            <Input
              placeholder={this.props.user.license}
              className={'name-class'}
            />
          )}
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 5 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default withRouter(
  connect(state => {
    return { user: state.user };
  })(Form.create()(Profile))
);
