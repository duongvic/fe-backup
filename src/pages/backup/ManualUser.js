import { Form, Button, Select, Spin, Switch, message } from 'antd';
import "antd/dist/antd.css";
// import { useDispatch } from 'react-redux';
// import { getListVM } from 'store/actions';
import React, {  useEffect, useState, useRef  } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import backupApi from 'api/backupApi';
import axiosClient from "api/axiosClient";
import {  API } from 'const';
import { FolderAddOutlined } from "@ant-design/icons";
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
    span: 15,
  },
};

function ManualUser(props)  {
  const onReset = () => {
    form.resetFields();
  };
  const onShowinput = () => {
    setShowvolume(!showvolume);
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
  const page = useRef(1);
  const pageSize = useRef(10);
  const noMore = useRef(false);
  // const stateInReduecer = useSelector(state => state);
  // const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [listvms, setListvms] = useState([]);
  const [listvolume, setListvolume] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingpage, setLoadingpage] = useState(false);
  const [loadinglistvm, setLoadinglistvm] = useState(false);
  const [showvolume, setShowvolume] = useState(true);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);

  const onFinish = async (e) => {
    try {
      setLoading(true);
      if(showvolume === false){
        const result = await axiosClient.post(API.CREATE_BACKUP, {
          "vm_id": e.vm_id,
          "volume_id": form.getFieldValue('volume'),
        })
        if (result) {
          setLoading(false);
          message.success("Backup create successfully");
        } 
        } else if( showvolume === true) {
        let volumeIdList = [];
        listvolume.map((element, index) => {
            if (
              element?.id !== null &&
              (typeof element?.id === "string" || element?.name instanceof String)
              ) {
              let itemVm = {
                id: element?.id,
                name: element?.name,
              };
              volumeIdList.push(itemVm);
            }
            return element;
          });
        const result = await axiosClient.post(API.CREATE_ALL_BACKUP, {
          "vm_id": e.vm_id,
          "volumes": volumeIdList,
        })
        if (result) {
          setLoading(false);
          message.success("Backup create successfully");
        } 
      }
    } catch (error) {
      message.error(error?.response?.data?.error)
      setLoading(false);
    }
  };

  const onChangeVM = async (e) => {
    setLoadinglistvm(true);
    const result = await axiosClient.get(`${API.LIST_VMS_VOLUMES}/${e}/volumes`)
      if(result)  {
        setLoadinglistvm(false);
        setListvolume(result);
      } else{
        setLoadinglistvm(true);
      }
  }
  const onChangeVolume = async (e) => {
    form.setFieldsValue({ volume: e });
  }
  useEffect(() => {
    const getListVm = async () => {
      setLoadinglistvm(true);
      const result = await backupApi.listVm()  
      if (result) {
        setListvms(result?.data);
        setLoadinglistvm(false);
      } else {
        setLoadinglistvm(true);
       
      }
    }
    getListVm();
  }, []);
  const loadMore = async (page, page_size) => {
    let newPage = 0;
    let newPageSize = 10 ;
    try {
      newPage += page.current;
      // setPage()
      newPageSize  += page_size.current;
      const result = await axiosClient.get(API.LIST_VM + `?page=${newPage}&page_size=${newPageSize}`);
        if (result?.next_page > 1) {
          noMore.current = true;
          setListvms(result?.data);
        } else {
          noMore.current = false;
        }
    } catch (error) {}
  };

  const onPopupScroll = e => {  
    e.persist();
    let target = e.target;
    if (!loadingpage  && !noMore.current && target.scrollTop + target.offsetHeight === target.scrollHeight) {
      loadMore(page, pageSize);
     } else {}
  };

  return (
    <div className="chart-tq back-all manual">
      {loadinglistvm ? (
        <>
          <Spin />
        </>
      ):(
        <Form  loadinglistvm={loadinglistvm} {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            label="VM"
            name="vm_id"
            rules={[{ required: true, message: 'Please input VM!' }]}
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
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
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
          <Form.Item label="Backup all Volumes:">
          <Switch className="center-box" checked={showvolume} onChange={onShowinput} checkedChildren="Yes" unCheckedChildren="No"/>
          </Form.Item>
          {!showvolume &&
            <Form.Item
            label="Volume"
            // rules={[{ required: true, message: 'Please input volume!' }]}
            name="volume">
            <Select
              onChange={(e) => onChangeVolume(e)}
              placeholder="Volume"
              className="form-control">
              {
                listvolume?.map((item, key) => {
                  return (
                    <Option value={item?.volume_id} key={key} >
                      {item?.name == null || item?.name === "" ? item?.id : item?.name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          }
          <Form.Item className="pd-20" {...tailLayout}>
            <Button type="primary" loading={loading} htmlType="submit">
            <FolderAddOutlined /> Backup now
            </Button>
            {/* <Button type="primary" loading={loading} htmlType="submit">
            <FolderAddOutlined /> User backup
            </Button> */}
            <Button htmlType="button" onClick={onReset}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
     
      )}
      
    </div>
  );
}

export default ManualUser;
