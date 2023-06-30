import React, { useState, } from 'react'
import { Button, notification, Form, Input, message } from 'antd';

import axios from "axios"
import { API } from 'const';
import { Redirect } from "react-router-dom";
import { setUserSession } from "api/token.service";
import LOGO from '../images/ic-logo.png';
import RequireOtp from './RequireOtp'
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function Login(props) {
  const [form] = Form.useForm();
  const [loading,setLoading] =useState(false);
  // const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [showModalOTP, setShowModalOTP] = useState(false);


  const openNotification = () => {
    notification.open({
      message: 'Login faild',
      description:
        'User password invalid"',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  const onFinish = async (e) => {

    try {
      setLoading(true);
      const result = await axios
      .post(API.LOGIN, {
        user_name: form.getFieldValue('user_name'),
        password: form.getFieldValue('password'),
      })
      
      if(result?.status === 200){
        setUserSession(result?.data?.access_token, result?.data);
        setRedirect(true);
      }else if(result?.status === 401 || 500){
        openNotification();
        setRedirect(false);
        message.success("Welcome to backup service")
      }
      setLoading(false);
    } catch (error) {
     if(error?.response?.status === 428){
       setShowModalOTP(true)
     }else{
      openNotification();
      //  setError(error?.response?.message)
     }
     setLoading(false);
    }
  };


  return redirect ? (
    <Redirect to="/" />
  ) : (
    <div className="login h-screen flex items-center justify-center">
        <div className="logo-login">
          <img src={LOGO} alt="" />
        </div>
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off">
           <h3>LOGIN BACKUP SERVICE</h3>
        <Form.Item
          name="user_name"
          rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          >
          <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />        
        </Form.Item>
        <Form.Item >
          <Button className="btn-100" type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
     
      <RequireOtp
       form ={form}
       showModalOTP={showModalOTP} />
    </div>
  )
}


export default Login