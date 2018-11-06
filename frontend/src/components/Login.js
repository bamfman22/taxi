import React from 'react';
import { connect } from 'react-redux';
import { message, Form, Input, Button, Row, Col, Select } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import './Login.css';
import { signUp, logIn } from '../actions/UserActions.js';
import cover from '../assets/images/login-cover.jpg';

class LoginSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.body = React.createRef();

    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  showErrorMessage(errors) {
    Array.concat
      .apply([], Object.values(errors).map((v, _) => v.errors))
      .map((v, _) => v.message)
      .forEach(msg => {
        message.error(msg);
      });
  }

  componentDidMount() {
    message.config({
      getContainer: () => this.body.current,
      top: 200
    });
  }

  componentWillUnmount() {
    message.destroy();
    message.config({
      getContainer: () => document.body,
      top: 24
    });
  }

  onSubmitForm(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return this.showErrorMessage(err);

      const action = this.props.signup
        ? signUp(values.email, values.name, values.password, values.role)
        : logIn(values.email, values.password);

      this.props.dispatch(action).then(
        resp => {
          if (this.props.signup && values.role === 'driver') {
            this.props.history.push('/driver/signup');
          } else {
            this.props.history.push('/');
          }
        },
        ({ errors }) => {
          errors.forEach(msg => message.error(msg));
        }
      );
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const signup = this.props.signup;
    const title = signup ? 'Sign Up' : 'Log In';
    const other = signup ? (
      <Link to="/login">Log In</Link>
    ) : (
      <Link to="/signup">Sign Up</Link>
    );

    return (
      <Row>
        <Col span={12} className="login-body">
          <div ref={this.body}>
            <Form className="login-form" onSubmit={this.onSubmitForm}>
              <span className="driver-link">
                {getFieldDecorator('role', {
                  initialValue: 'passenger',
                  rules: [{ required: true, message: 'Please select a role' }]
                })(
                  <Select style={{ width: 130 }}>
                    <Select.Option value="passenger">Passenger</Select.Option>
                    <Select.Option value="driver">Driver</Select.Option>
                  </Select>
                )}
              </span>
              <h1>{title}</h1>
              {signup && (
                <Form.Item hasFeedback help="">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Name is required' }]
                  })(
                    <Input
                      size="large"
                      placeholder="Name"
                      autoComplete="name"
                    />
                  )}
                </Form.Item>
              )}
              <Form.Item hasFeedback help="">
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: 'Email is required' }]
                })(
                  <Input
                    size="large"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                  />
                )}
              </Form.Item>
              <Form.Item hasFeedback help="">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Password is required' }]
                })(
                  <Input
                    size="large"
                    placeholder="Password"
                    type="password"
                    autoComplete={signup ? 'new-password' : 'current-password'}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 10 }}
                >
                  {title}
                </Button>
                or {other}
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col
          span={12}
          style={{
            backgroundImage: `url(${cover})`,
            backgroundSize: 'cover',
            height: '100vh'
          }}
        />
      </Row>
    );
  }
}

export default withRouter(connect()(Form.create({})(LoginSignup)));
