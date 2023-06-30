import {
  Form,
  Button,
  Select,
  Switch,
  InputNumber,
  Input,
  Modal,
  message,
  TimePicker,
} from "antd";
import "antd/dist/antd.css";
import { API } from "const";
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getListUser } from 'store/actions';
import axiosClient from "api/axiosClient";
import moment from "moment";
const { Option } = Select;

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
    offset: 10,
    span: 15,
  },
};

const Createpolicy = (props) => {
  const days_of_week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const day_map = new Map();
  for (let i = 0; i < days_of_week.length; i++) {
    day_map.set(days_of_week[i], i);
  }
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  // const [retentionDays, setRetentionDays] = useState(-1);
  const [retentionWarning, setRetentionWarning] = useState(false);
  // const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState();
  // const page = useRef(1);
  // const pageSize = useRef(10);
  // const noMore = useRef(false);
  const [listuser, setListuser] = useState([]);
  // const [loadingpage, setLoadingpage] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);

  const [loading, setLoading] = useState(false);
  const [showvolume, setShowvolume] = useState(true);
  const [listGroupbackup, setListGroupbackup] = useState([]);
  // const [listUsername, setListUsername] = useState([]);
  const [timeState, setTimeState] = useState("");
  const timeFormat = "HH:mm";

  const onReset = () => {
    form.resetFields();
  };

  const onShowinput = () => {
    setShowvolume(!showvolume);
  };
  // const handleOnchangeRetentionDay = (e) => {
  //   setRetentionDays(e);
  //   let i = daysOfWeek.length;
  //   let dif_max = 0;

  //   if (i > 1) {
  //     let before_next_cycle =
  //       7 -
  //       Math.abs(day_map.get(daysOfWeek[0]) - day_map.get(daysOfWeek[i - 1]));
  //     for (let k = i - 1; k > 0; k--) {
  //       let diff = day_map.get(daysOfWeek[k]) - day_map.get(daysOfWeek[k - 1]);
  //       if (diff > dif_max) {
  //         dif_max = diff;
  //       }
  //     }
  //     if (dif_max < before_next_cycle) {
  //       dif_max = before_next_cycle;
  //     }
  //   } else if (i === 1) {
  //     dif_max = 7;
  //   }

  //   if (retentionDays <= dif_max) {
  //     setRetentionWarning(true);
  //   } else {
  //     setRetentionWarning(false);
  //   }
  // };

  const handleOk = async (items) => {
    try {
      setLoading(true);
      let timeString, timeArray, startTime;
      if (timeState) {
        timeString = timeState.format(timeFormat);
        timeArray = timeString.split(":");
        startTime = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
      }
      if (showvolume === false) {
        const postData = await axiosClient.post(API.CREATE_POLICY, {
          group_id: form.getFieldValue("group_id"),
          user_id: form.getFieldValue("user_id"),
          mode: "BACKUP",
          name: items.name,
          days_of_week: items?.days_of_week ? items?.days_of_week : undefined,
          start_time: startTime ? startTime : undefined,
          retention: items?.retention ? items.retention : undefined,
        });
        if (postData) {
          handleCancel();
          props.setReload((pre) => !pre);
          message.success("Create Policies success.");
        }
      } else if (showvolume === true) {
        const postData1 = await axiosClient.post(API.CREATE_POLICY, {
          group_id: form.getFieldValue("group_id"),
          user_id: form.getFieldValue("user_id"),
          mode: "BACKUP",
          name: items.name,
          days_of_week: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
          start_time: "0",
          retention: "-1",
        });
        if (postData1) {
          handleCancel();
          props.setReload((pre) => !pre);
          message.success("Create Policies success.");
        }
      }
    } catch (error) {
      message.error(error?.response?.data?.errors?.[0]?.message);
    }
    setLoading(false);
  };
  const handleCancel = () => {
    props.setVisible(false);
    form.resetFields();
  };

  const onChangevolume = async (e) => {
    form.setFieldsValue({ group_id: e });
  };
  useEffect(() => {
    if (props.visible === true) {
      const getListVm = async () => {
        const result = await axiosClient.get(
          API.LIST_USER + `?page=1&page_size=1000`
        );
        if (result) {
          setListuser(result?.data);
        }
      };
      getListVm();
    }
  }, [props.visible]);
  const onChangeUser = async (e) => {
    const result = await axiosClient.get(
      API.LIST_GROUP_BACKUP + `?user_id=${e}`
    );
    if (result) {
      setListGroupbackup(result?.data);
      form.setFieldsValue({ user_id: e });
    }
  };

  function onFocus() {
    console.log("focus");
  }
  function onSearch(val) {
    console.log("search:", val);
  }

  
  return (
    <Modal
      title="Create policy"
      visible={props.visible}
      destroyOnClose={true}
      width={700}
      footer={false}
      onCancel={handleCancel}
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={handleOk}>
        {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
          <Form.Item
            label="Username"
            name="user"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Username"
              className="form-control"
              onChange={(e) => onChangeUser(e)}
              optionFilterProp="children"
              onFocus={onFocus}
              // onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listuser?.map((item, key) => {
                return (
                  <Option
                    value={item?.id}
                    key={key}
                    disabled={item?.has_storage === false}
                  >
                    {item?.user_name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Policy name:"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Backup for Database" />
        </Form.Item>
        <Form.Item
          label="Group"
          name="group_id"
          rules={[{ required: true, message: "Please input group id!" }]}
        >
          <Select
            placeholder="Group Name"
            className="form-control"
            onChange={(e) => onChangevolume(e)}
          >
            {listGroupbackup?.map((item, key) => {
              return (
                <Option value={item?.id} key={key} disabled={item?.in_job}>
                  {item?.name || item?.group_id}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <div className="switch-btn">
          <p>
            Using{" "}
            <a
              className="green-btn"
              href="https://docs.fptvds.vn/s/c4hh313uh0lc9ct5ascg/service-documents/d/c4j1u3juh0lc9ct5asj0/gioi-thieu-dich-vu-backup-tren-fpt-vds?currentPageId=c4j4rljuh0lc9ct5asq0"
              target="_blank">
              default policy:
            </a>
          </p>

          <Switch
            checked={showvolume}
            onChange={onShowinput}
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </div>

        {!showvolume ? (
          <div>
            <Form.Item
              label="Days of week:"
              name="days_of_week"
              rules={[{ required: true, message: "Please input day of week!" }]}
            >
              <Select
                mode="multiple"
                onChange={(e) => setDaysOfWeek(e)}
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select days backup"
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
              rules={[{ required: true, message: "Please input Start time!" }]}
            >
              <TimePicker
                initialValues={moment("12:00", timeFormat)}
                format={timeFormat}
                onChange={(e) => setTimeState(e)}
              />
            </Form.Item>
            <Form.Item
              name="retention"
              label="Retention"
              rules={[{ required: true, message: "Please input Retention!" }]}
            >
              <InputNumber
                placeholder="Please input Retention"
                max={60}
                min={1}
              />
            </Form.Item>
          </div>
        ) : null}

        <Form.Item {...tailLayout}>
          <Button
            className="btn-next"
            loading={loading}
            disabled={retentionWarning}
            type="primary"
            htmlType="submit"
          >
            {props.mode === "create" ? "Save" : "Save"}
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Createpolicy;
