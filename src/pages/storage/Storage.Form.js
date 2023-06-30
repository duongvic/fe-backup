import React, {  useState  } from 'react';
import {  Form, Button, Modal, Input, message } from 'antd'
import { API } from 'const';
// import axios from 'axios';
import axiosClient from "api/axiosClient";


const StorageForm = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const [value, setValue] = useState('99');
  // const [reload, setReload] = useState(false);
 
  const handleOk = async (items) => {
    try {
      setLoading(true);
    const postData = await axiosClient.put(API.UPDATE_STORAGES + '/' + props.storage.id,{"disk_allowed": items.disk_allowed,});
    if (postData) {
      handleCancel();
      props.setReload(pre => !pre);
      message.success("Storage update successfully");
    }
    } catch (error) {
      message.error(error?.response?.data?.errors?.[0]?.message)
    }
    setLoading(false);
  };
  
  const handleCancel = () => {
    props.setVisible(false)
  };

  return (
    <Modal  title="Update Storage"
      visible={props.visible}
      forceRender={true}
      footer={false}
      onCancel={handleCancel}>
      <Form form={form} name="horizontal_login" layout="vertical" onFinish={handleOk}>
      <Form.Item  name="disk_allowed" label="Disk allowed" >
          <Input suffix="GB" className="witdh-60" placeholder="Disk allowed" />
        </Form.Item>
        
        <Form.Item className="right-btn">
          <Button className="btn-next" loading={loading} type="primary" htmlType="submit">
            Save
          </Button>

        </Form.Item>
      </Form>
    </Modal>
  );
}
export default StorageForm;
