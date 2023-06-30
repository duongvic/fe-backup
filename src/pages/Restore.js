import { Form, Button, Select, notification } from 'antd';

import "antd/dist/antd.css";
import axios from "axios";
import { API, SUCCESS_CODE, headers } from 'const';
import React, { useState, useEffect } from "react";
const { Option } = Select;

// import Slider from "./components/Slider";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 18,
    span: 5,
  },
};

function Restore() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [form] = Form.useForm();
  const [listvms, setListvms] = useState([]);
  const [listvolume, setListvolume] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const openNotificationWithIcon = type => {
    if (type === "success") {
      notification[type]({
        message: 'success',
      })
    } else if (type === "error") {
      notification[type]({
        message: 'faild'
      })
    }
  };
  const onFinish = async (e) => {
    try {
      setLoading(true);
      const result = await axios.post(API.CREATE_BACKUP, {
        "storage_name": user.user_name,
        "volume_id": form.getFieldValue('volume'),
      }, { headers: headers })
      if (result?.status === SUCCESS_CODE) {
        setLoading(true);
        openNotificationWithIcon('success')

      } else {
        openNotificationWithIcon('error')
        setLoading(false);
      }
    } catch (error) {
      openNotificationWithIcon('error')
      setLoading(false);
    }
  };
 
  const onChangeVM = async (e) => {
    axios.get(API.LIST_VMS_VOLUMES + "/" + e + "/volumes",

      { headers: headers })
      .then((response) => {
        const red = response.data;
        setListvolume(red);
      })
      .catch((error) => { });
  }
  const onChangevolume = async (e) => {
    form.setFieldsValue({ volume: e });
  }

  useEffect(() => {
    axios.get(API.LIST_VM, { headers: headers })
      .then((response) => {
        const red = response.data;
        setListvms(red);
      })
      .catch((error) => { });

  }, []);
  const onReset = () => {
    form.resetFields();
  };
  return (
    <div className="chart-tq back-all">
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item
          label="VM">
          <Select
            placeholder="VM"
            onChange={(e) => onChangeVM(e)}
            className="form-control">
            {
              listvms?.map((item, key) => {
                return (
                  <Option value={item?.id} key={key}>
                    {item?.name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          label="Volume"
          name="volume"
        >
          <Select
            onChange={(e) => onChangevolume(e)}
            placeholder="Volume"

            className="form-control">
            {
              listvolume?.map((item, key) => {
                return (
                  <Option value={item?.id} key={key} >
                    {item?.volumeId}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        {/* <div className="flex-around pd-20">
          <p>Backup all VM's Volume: </p>
          <Switch
            checked={showvolume}
            onChange={onShowinput}
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </div> */}
        <Form.Item {...tailLayout}>
          <Button type="primary" loading={loading} htmlType="submit">
            Backup now
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Cancel
          </Button>

        </Form.Item>
      </Form>
    </div>
  );
}

export default Restore;
