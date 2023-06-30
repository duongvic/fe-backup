import React, { useEffect, useState } from "react";
import {
  InputNumber,
  Form,
  Button,
  Modal,
  Select,
  TimePicker,
  Input,
  message,
} from "antd";
import axiosClient from "api/axiosClient";
import { API } from "const";
import moment from "moment";

const { Option } = Select;
const timeFormat = "HH:mm";
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 15,
  },
};
const PolicyForm = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [timeState, setTimeState] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);


  const handleOk = async (items) => {
    try {
    setLoading(true);
    const timeString = items.start_time.format(timeFormat);
    const timeArray = timeString.split(":");
    const startTime = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    const postData = await axiosClient.put(API.UPDATE_POLICY + "/" + props.policy.id,
      {
        days_of_week: items.days_of_week,
        start_time: startTime,
        retention: items.retention,
        name: items.name,
      }
    );
    if (postData) {
      handleCancel();
      props.setReload(pre => !pre);
      message.success("Update policy successful!");
    }
    } catch (error) {
      message.error(error?.response?.data?.errors?.[0]?.message)
    }
    setLoading(false);
  };

  const handleCancel = () => {
    props.setVisible(false);
  };

  // const onReset = () => {
  //   form.resetFields();
  // };

  useEffect(() => {
    let propsInForm = props?.policy;
    let policyDays = props?.policy?.days_of_week;
    let b;
    if (propsInForm) {
      let timeState = props?.policy?.start_time;
      if (Number.isInteger(timeState)) {
        b =
          timeState && Number.isInteger(timeState)
            ? moment(
                `${String(Math.floor(props?.policy?.start_time / 60)).padStart(
                  2,
                  "0"
                )}:${String(props?.policy?.start_time % 60).padStart(2, "0")}`,
                timeFormat
              )
            : undefined;
      } else {
        b = moment(timeState);
      }
      setTimeState(b);
      propsInForm.start_time = b;
      if (typeof policyDays === "string") {
        policyDays = propsInForm?.days_of_week?.split(",");
      }
      propsInForm.days_of_week = policyDays;
    }
    form.setFieldsValue(propsInForm);
  }, [props, form]);

  return (
    <Modal
      title={`Edit Policy: ${props?.policy?.user_name}_${props?.policy?.name}`}
      visible={props.visible}
      forceRender={true}
      footer={false}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        name="horizontal_login"
        layout="vertical"
        onFinish={handleOk}
      >
        <div>
          <Form.Item
            name="name"
            label="Policy Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Backup for Database" allowClear />
          </Form.Item>

          <Form.Item
            name="days_of_week"
            label="Backup Days"
            initialValues={daysOfWeek}
            rules={[{ required: true, message: "Please input day of week!" }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
            >
              <Option value="mon">Mon</Option>
                <Option value="tue">Tue</Option>
                <Option value="wed">Wed</Option>
                <Option value="thu">Thu</Option>
                <Option value="fri">Fri</Option>
                <Option value="sat">Sat</Option>
                <Option value="sun">Sun</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="start_time"
            label="Start Time"
            rules={[{ required: true, message: "Please input Start Time!" }]}
          >
            <TimePicker
              initialValues={timeState}
              format={timeFormat}
              onChange={(e) => setTimeState(e)}
            />
          </Form.Item>

          <Form.Item
            name="retention"
            label="Retention"
            rules={[{ required: true, message: "Please input Retention!" }]}
          >
            <InputNumber placeholder="Retention" max={60} min={1} />
          </Form.Item>
        </div>

        <Form.Item {...tailLayout}>
          <Button
            className="btn-next"
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Save
          </Button>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PolicyForm;
