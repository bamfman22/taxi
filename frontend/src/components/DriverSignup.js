import React from 'react';
import { connect } from 'react-redux';
import { message, Form, Input, Button, Row, Col, Upload, Icon } from 'antd';
import { withRouter } from 'react-router';

import './Login.css';
import { driverSignup } from '../actions/UserActions';
import cover from '../assets/images/login-cover.jpg';

class DriverSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };

    this.body = React.createRef();

    this.onSubmitForm = this.onSubmitForm.bind(this);
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

  showErrorMessage(errors) {
    Array.prototype.concat
      .apply([], Object.values(errors).map((v, _) => v.errors))
      .map((v, _) => v.message)
      .forEach(msg => {
        message.error(msg);
      });
  }

  onSubmitForm(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return this.showErrorMessage(err);

      console.log(values);
      this.props
        .dispatch(
          driverSignup(
            values.phone,
            values.plate,
            values.driver_license,
            values.license.file.response.token
          )
        )
        .then(
          resp => {
            this.props.history.push('/');
          },
          ({ errors }) => {
            errors.forEach(msg => message.error(msg));
          }
        );
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const self = this;

    return (
      <Row>
        <Col span={12} className="login-body">
          <div ref={this.body}>
            <Form className="login-form" onSubmit={this.onSubmitForm}>
              <h1>Driver Information</h1>
              <Form.Item hasFeedback help="">
                {getFieldDecorator('phone', {
                  rules: [
                    { required: true, message: 'Phone number is required' },
                    {
                      len: 10,
                      message: 'Phone number should be 10-digit long'
                    },
                    {
                      pattern: '^[0-9]{10}$',
                      message: 'Invalid phone number'
                    }
                  ]
                })(
                  <Input size="large" type="text" placeholder="Plate Number" />
                )}
              </Form.Item>
              <Form.Item hasFeedback help="">
                {getFieldDecorator('plate', {
                  rules: [
                    { required: true, message: 'Plate number is required' },
                    {
                      max: 7,
                      message:
                        'Plate number cannot contain more than 7 characters'
                    },
                    {
                      pattern: '^[a-zA-Z0-9]{1,7}$',
                      message: 'Invalid plate number'
                    }
                  ]
                })(
                  <Input size="large" type="text" placeholder="Plate Number" />
                )}
              </Form.Item>
              <Form.Item hasFeedback help="">
                {getFieldDecorator('driver_license', {
                  rules: [
                    {
                      required: true,
                      message: 'Driver license number is required'
                    },
                    {
                      pattern: '^[a-zA-Z][0-9]{7}$',
                      message: 'Invalid driver license number'
                    }
                  ]
                })(
                  <Input
                    size="large"
                    type="text"
                    placeholder="Driver License Number"
                  />
                )}
              </Form.Item>
              <Form.Item help="">
                {getFieldDecorator('license', {
                  rules: [
                    {
                      required: true,
                      message: 'Driver license picture is required'
                    }
                  ]
                })(
                  <Upload.Dragger
                    name="license"
                    action="/member/upload"
                    accept="image/*"
                    withCredentials
                    data={file => {
                      return { file, type: 'license' };
                    }}
                    listType="picture"
                    onChange={({ fileList }) => {
                      self.setState({ fileList: fileList.slice(-1) });
                    }}
                    fileList={this.state.fileList}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="idcard" />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag to upload your
                    </p>
                    <p className="ant-upload-text">driver license</p>
                  </Upload.Dragger>
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 10 }}
                >
                  Submit
                </Button>
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

export default withRouter(connect()(Form.create({})(DriverSignup)));
