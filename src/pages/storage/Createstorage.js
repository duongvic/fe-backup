import React, {  useState, useEffect, useRef  } from 'react';
import {  Form, Button, Modal, Input, message, Select } from 'antd'
import { API } from 'const';
// import axios from 'axios';
import axiosClient from "api/axiosClient";
const { Option } = Select;

const Createstorage = (props) => {
  const page = useRef(1);
  const pageSize = useRef(10);
  const noMore = useRef(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [loadingpage, setLoadingpage] = useState(false);
  const handleOk = async (items) => {
    setLoading(true);
    try {
      const postData = await axiosClient.post(API.CREATE_STORAGES,{
        "disk_allowed": items.disk_allowed,
        "user_id": form.getFieldValue('user_id'),
      });
      if (postData) {
        handleCancel();
        props.setReload(pre => !pre);
        message.success("Storage update successfully");
      }
    } catch (error) {
      message.error(error?.response?.data?.message)
    }
    setLoading(false);
  };
  function onBlur() {
    console.log('blur');
  }
  function onFocus() {
    console.log('focus');
  }
  function onSearch(val) {
    console.log('search:', val);
  }
  useEffect(() => {
    if (props.visible === true) {
      const getListUser = async () => {
        const result = await axiosClient.get(API.LIST_USER+ `?page=1&page_size=350`);
        if (result) {
          const a = result?.data
          setListUser(a);
          } else {
            setListUser([]);
        }
        setListUser(result?.data);
      };
      getListUser();
    }
    
  }, [props.visible]);
  const handleCancel = () => {
    props.setVisible(false)
  };
  const onChangeUser = async (e) => {
    form.setFieldsValue({ group_id: e });
  }
  const loadMoreUser = async (page, page_size) => {
    let newPage = 0;
    let newPageSize = 10 ;
    try {
      newPage += page.current;
      // setPage()
      newPageSize  += page_size.current;
      const result = await axiosClient.get(API.LIST_USER + `?page=${newPage}&page_size=150`);
        if (result?.has_more) {
          noMore.current = true;
          setListUser(result?.data);
        } else {
          noMore.current = false;
        }
    } catch (error) {}
  };

  const onPopupScrollUser = e => { 
    e.persist();
    let target = e.target;
    if (!loadingpage  && !noMore.current && target.scrollTop + target.offsetHeight === target.scrollHeight) {
      // dynamic add options...
      loadMoreUser(page, pageSize);
     } else {}
  };
  return (
    <Modal  title="Create Storage"
      visible={props.visible}
      forceRender={true}
      footer={false}
      onCancel={handleCancel}>
      <Form form={form} name="horizontal_login" layout="vertical" onFinish={handleOk}>
      <Form.Item label="Username" name="user_id" rules={[{required: false,},]}>
          <Select
            placeholder="Username"
            className="form-control"
            onChange={(e) => onChangeUser(e)}
            showSearch
            placeholder="Select a Username"
            className="form-control"
            optionFilterProp="children"
            onPopupScroll={onPopupScrollUser}
            onFocus={onFocus}
            // onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {
              listUser?.map((item, key) => {
                return (
                  <Option value={item?.id} key={key} disabled={item?.has_storage}>
                  {item?.user_name}
                </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item name="disk_allowed" label="Disk allowed" >
          <Input suffix="GB" className="witdh-60" type="number" placeholder="Disk allowed" />
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
export default Createstorage;
