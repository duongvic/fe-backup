import { Form, Button, Select, Spin, Switch, message } from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState, useRef } from "react";
import axiosClient from "api/axiosClient";
import { API } from "const";
import { FolderAddOutlined, FolderViewOutlined } from "@ant-design/icons";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 15,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 17,
  },
};

function ManualAdmin(props) {
  const page = useRef(1);
  const pageSize = useRef(10);
  const noMore = useRef(false);
  const [form] = Form.useForm();
  const [listvms, setListvms] = useState([]);
  const [listvolume, setListvolume] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingpage, setLoadingpage] = useState(false);
  const [loadinglistvm, setLoadinglistvm] = useState(false);
  const [showvolume, setShowvolume] = useState(true);
  const [listuser, setListuser] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [hasstorage, setHasStorage] = useState();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);

  const onChangeAd = async (e) => {
    try {
      if (showvolume === false) {
        const result = await axiosClient.post(API.CREATE_BACKUP, {
          is_admin_backup: true,
          volume_id: form.getFieldValue("volume"),
          vm_id: form.getFieldValue("vm_id"),
          user_id: form.getFieldValue("user_id"),
        });
        if (result) {
          setLoading(false);
          message.success("Backup create successfully");
        }
      } else if (showvolume === true) {
        let volumeIdList = [];
        listvolume.map((element, index) => {
          if (element) {
            volumeIdList.push(element?.id);
            
          }
        });
        const result = await axiosClient.post(API.CREATE_BACKUP, {
          is_admin_backup: true,
          volume_id: volumeIdList,
          vm_id: form.getFieldValue("vm_id"),
          user_id: form.getFieldValue("user_id"),
        });
        if (result) {
          setLoading(false);
          message.success("Backup create successfully");
        }
      }
    } catch (error) {
      message.error(error?.response?.data?.errors?.[0]?.message);
      setLoading(false);
    }
  };

  const onChangeUserSb = async (e) => {
    try {
      if (showvolume === false) {
        const result = await axiosClient.post(API.CREATE_BACKUP, {
          vm_id: form.getFieldValue("vm_id"),
          volume_id: form.getFieldValue("volume"),
          user_id: form.getFieldValue("user_id"),
        });
        if (result) {
          setLoading(false);
          message.success("Backup create successfully");
        }
      } else if (showvolume === true) {
        let volumeIdList = [];
        listvolume.map((element, index) => {
          if (element) {
            volumeIdList.push(element?.id);
          }
        });
        const result = await axiosClient.post(API.CREATE_BACKUP, {
          vm_id: form.getFieldValue("vm_id"),
          volume_id: volumeIdList,
          user_id: form.getFieldValue("user_id"),
        });
        if (result) {
          setLoading(false);
          message.success("Backup create successfully");
        }
      }
    } catch (error) {
      message.error(error?.response?.data?.errors?.[0]?.message);
      setLoading(false);
    }
  };

  const onChangeVM = async (e) => {
    setLoadinglistvm(true);
    const result = await axiosClient.get(
      `${API.LIST_VMS_VOLUMES}/${e}/volumes`
    );
    if (result) {
      setLoadinglistvm(false);
      setListvolume(result);
    } else {
      setLoadinglistvm(true);
    }
  };
  const onChangeUser = async (a) => {
    setLoadinglistvm(true);
    const res = await axiosClient.get(API.LIST_USER + `?page=1&page_size=10`);
    if (res) {
      const b = res?.data?.filter((item) => item.id === a)
        ?.map((item) => {
          const has_storage = item?.has_storage;
          return has_storage;
        });
      setHasStorage(b[0]);
    }
    const result = await axiosClient.get(API.LIST_VM + `?user_id=` + a);
    if (result) {
      setLoadinglistvm(false);
      setListvms(result?.data);
      form.setFieldsValue({ user_id: a });
    } else {
      setLoadinglistvm(true);
    }
  };
  const onChangevolume = async (e) => {
    form.setFieldsValue({ volume: e });
  };

  useEffect(() => {
    const getListUser = async () => {
      setLoadinglistvm(true);
      const result = await axiosClient.get(
        API.LIST_USER + `?page=1&page_size=90`
      );
      if (result) {
        setLoadinglistvm(false);
        setListuser(result?.data);
        // setHasStorage(result?.data?.map(item => item?.has_storage))
      } else {
        setLoadinglistvm(true);
      }
    };
    getListUser();
  }, []);

  // const onReset = () => {
  //   form.resetFields();
  // };
  const onShowinput = () => {
    setShowvolume(!showvolume);
  };
  function onBlur() {
    console.log("blur");
  }
  function onFocus() {
    console.log("focus");
  }
  function onSearch(val) {
    console.log("search:", val);
  }
  // const loadMore = async (page, page_size) => {
  //   let newPage = 0;
  //   let newPageSize = 10 ;
  //   try {
  //     newPage += page.current;
  //     // setPage()
  //     newPageSize  += page_size.current;
  //     const result = await axiosClient.get(API.LIST_VM + `?page=${newPage}&page_size=10`);
  //       if (result?.has_more === true) {
  //         noMore.current = true;
  //         setListvms(result?.data);
  //         debugger

  //       } else {
  //         noMore.current = false;
  //       }
  //   } catch (error) {}
  // };
  // const onPopupScroll = e => {
  //   e.persist();
  //   let target = e.target;
  //   if (!loadingpage  && !noMore.current && target.scrollTop + target.offsetHeight === target.scrollHeight) {
  //     // dynamic add options...
  //     loadMore(page, pageSize);
  //    } else {}
  // };
  const loadMore = async (page, page_size) => {
    let newPage = 0;
    let newPageSize = 10;
    try {
      newPage += page.current;
      // setPage()
      newPageSize += page_size.current;
      const result = await axiosClient.get(
        API.LIST_VM + `?page=${newPage}&page_size=${newPageSize}`
      );
      if (result?.next_page > 1) {
        noMore.current = true;
        setListvms(result?.data);
        setLoadingpage(true);
      } else {
        noMore.current = false;
      }
    } catch (error) {}
  };

  const onPopupScroll = (e) => {
    e.persist();
    let target = e.target;
    if (
      !loadingpage &&
      !noMore.current &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      // dynamic add options...
      loadMore(page, pageSize);
    }
  };

  return (
    <div className="chart-tq back-all manual">
      {loadinglistvm ? (
        <Spin />
      ) : (
        <Form
          loadinglistvm={loadinglistvm}
          {...layout}
          form={form}
          name="control-hooks"
        >
          {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
            <Form.Item
              label="User"
              name="user"
              rules={[{ required: true, message: "Please input User" }]}
            >
              <Select
                showSearch
                placeholder="Select a Username"
                className="form-control"
                optionFilterProp="children"
                onChange={(a) => onChangeUser(a)}
              >
                {listuser?.map((item, key) => {
                  return (
                    <Option value={item?.id} key={key}>
                      {item?.user_name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            label="VM"
            name="vm_id"
            rules={[{ required: true, message: "Please input VM!" }]}
          >
            <Select
              showSearch
              placeholder="Select a VM"
              onChange={(e) => onChangeVM(e)}
              className="form-control"
              optionFilterProp="children"
              onPopupScroll={onPopupScroll}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listvms?.map((item, key) => {
                return (
                  <Option value={item?.id} key={key}>
                    {item?.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Backup all Volumes:">
            <Switch
              className="center-box"
              checked={showvolume}
              onChange={onShowinput}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
          </Form.Item>
          {!showvolume && (
            <Form.Item
              label="Volume"
              rules={[{ required: true, message: "Please input volume!" }]}
              name="volume"
            >
              <Select
                onChange={(e) => onChangevolume(e)}
                placeholder="Volume"
                className="form-control"
              >
                {listvolume?.map((item, key) => {
                  return (
                    <Option value={item?.volume_id} key={key}>
                      {item?.name === null || item?.name === ""
                        ? item?.id
                        : item?.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}
          <Form.Item className="pd-20" {...tailLayout}>
            <Button
              onClick={onChangeAd}
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              <FolderAddOutlined /> Admin Backup
            </Button>
            <Button
              disabled={hasstorage === false}
              onClick={onChangeUserSb}
              loading={loading}
              htmlType="submit"
            >
              <FolderViewOutlined /> User backup
            </Button>
            {/* <Button htmlType="button" onClick={onReset}>
              Reset
            </Button> */}
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default ManualAdmin;
