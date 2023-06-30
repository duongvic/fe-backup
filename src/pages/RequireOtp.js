import React, { useState,  } from 'react'
import { Button,Modal, Form,Input } from 'antd';
import { Pattern } from '../const/config';
import { API } from 'const';
import axios from "axios"
import { setUserSession } from "../utils/helpers";
import { useHistory } from 'react-router';

const RequireOtp = props => {

  const history = useHistory();
  const [form] = Form.useForm();
  const [loading,setLoading]= useState(false)
  const [errorOTP, setErrorOTP] = useState(null);
  // const [, setRedirect] = useState(false);
  const [,setVisible] = useState(props.showModalOTP)

    const onFinish = (e) => {
      setLoading(true);
      axios
      .post(API.LOGIN, {
        user_name: props.form.getFieldValue('user_name'),
        password:props.form.getFieldValue('password'),
        otp_token: e?.otp_token
      })
      .then((response) => {
        if(response?.status === 200){
          const red = response?.data;
          setUserSession(red.access_token, red);
          history.push("/");
          setVisible(false)
        }else{
          setErrorOTP('Invalid OTP')
          setVisible(true)
        }
        setLoading(false)
      })
      .catch((error) => {
        // setRedirect(false)
        setLoading(false)
        setErrorOTP('Invalid OTP')
      });
    };
    const handleCancel = () => {
      setVisible(false);
    };
    return (
        <Modal
          title='Authenticate by OTP'
          visible={props.showModalOTP}
          width={335}
          footer={null}
          onCancel={handleCancel}>
          <p style={{ textAlign: 'center', color: errorOTP ? 'red' : '' }}>
            {errorOTP ? errorOTP : ''}
          </p>
          <Form onFinish={onFinish} form={form}>
            <Form.Item
              name="otp_token"
              rules={[
                { required: true, message: 'Please enter your OTP' },
                { pattern: Pattern.OTP, message: 'Invalid OTP' }
              ]}
            >
              <Input
                style={{ width: '100%' }}
                size="large"
                placeholder={'Insert OTP'}
              
                maxLength={6}
                autoFocus
              ></Input>
            </Form.Item>
            {/* <NavLink to="/forgot-qrcode">
              {t('Title.LOST_GOOGLE_AUTHENTICATOR_ACCOUNT')}
            </NavLink> */}
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                block
                style={{ marginTop: '1rem' }}
                htmlType="submit"
              >
                SUBMIT
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      );
}
export default RequireOtp