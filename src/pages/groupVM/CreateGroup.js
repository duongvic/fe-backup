import React, { useEffect, useState, useRef, useCallback } from "react";
import { Form, Button, Modal, Input, Spin, Tree, message, Pagination, Select } from "antd";
import cls from "classnames";
import { API } from "const";
// import { vmTree } from './data.js';
import axiosClient from "api/axiosClient";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};
const CreateGroup = (props) => {
  const page = useRef(1);
  const pageSize = useRef(10);
  const noMore = useRef(false);
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingListVm, setLoadingListVm] = useState(0);
  const [volumeList, setVolumeList] = useState([]);
  const [idKeyDefaultCheckbox, setIdKeyDefaultCheckbox] = useState([]);
  const [arrChecked, setArrChecked] = useState([]);
  // const [filterOption, setFilterOption] = useState({});
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 10,
  //   showQuickJumper: true,
  // }); 
  const [listuser, setListuser] = useState([]);
  const [loadinglistvm, setLoadinglistvm] = useState(false);
 
  const [loadingpage, setLoadingpage] = useState(false);


  // const handleVolumeChange = async (pageChange) => {
  //   const response = await axiosClient.get(API.LIST_VM + `?page=${pageChange ? pageChange : 1}&page_size=10`);
  //   if (response) {
  //     let vmList = [];
             
  //             let treeData = vmList?.map((item) => {
  //               return {
  //                 title: item.name,
  //                 key: item.id,
  //                 children: vmList.map((element, index) => {
  //                   let name =
  //                     element.name === null || element.name === ""
  //                       ? element.id
  //                       : element.name;
  //                   return {
  //                     title:  name + "-" + element.size + "GB",
  //                     key: element.id + "~" + item.id,
  //                     disabled: element.disabled === false ? element.disabled : element.in_group,
  //                   };
  //                 }),
  //               };
  //             });
  //         setVolumeList(treeData);
  //         setLoadingListVm(false);
              
  //         setFilterOption({
  //           ...filterOption,
  //           page: pageChange.current,
  //         });
  //         setPagination({
  //           ...pagination,
  //           total:
  //           response?.has_more
  //               ? response?.data?.length + pageChange.current * pageChange.pageSize
  //               : pageChange.current * pageChange.pageSize,
  //           current: pageChange.current,
  //         });
  //       }
  //     };

      const onChangeUser = async (valueUser) => {
        setLoadingListVm(true);
        const result = await axiosClient.get(API.LIST_VM + `?user_id=${valueUser}`);
        if (result) {
          form.setFieldsValue({ user_id: valueUser });
          let vmList = [];
          if(result?.data !== null){
            for (const item of result?.data) {
              if (item.volumes !== null) {
                vmList.push(item);
              } 
            }
          }
          let treeData = vmList?.map((item) => {
            const volumes = item?.volumes;
            return {
              title: item.name,
              key: item.id,
              children: volumes.map((element, index) => {
                let name =
                  element.name === null || element.name === ""
                    ? element.id
                    : element.name;
                return {
                  title:  name + "-" + element.size + "GB",
                  key: element.id + "~" + item.id + "~" + element?.name,
                  disabled: element.in_group,
                };
              }),
            };
          });
          setVolumeList(treeData);
          let arrChecked = [];
          for (let i = 0; i < treeData?.length; i++) {
            for (let j = 0; j < treeData?.[i].children?.length; j++) {
              let obj = {};
              if (treeData[i]?.children?.[j]?.disabled === true) {
                obj.id = treeData[i]?.children?.[j]?.key;
                // obj.vm_id = `${treeData[i]?.key}`;
                arrChecked.push(obj);
              }
            }
          }
          const newArrChecked = arrChecked?.map((item) => {
            return item["id"];
          });
          setIdKeyDefaultCheckbox(newArrChecked);
          setArrChecked(arrChecked);

          setLoadingListVm(false);
        } else {
          setVolumeList([]);
          setLoadingListVm(false);
        }
      }; 
  
  useEffect(() => {
    if (props.visible === true) {
    const getListUser = async () => {
      setLoadinglistvm(true)
      const result = await axiosClient.get(API.LIST_USER + `?page=1&page_size=1000`)  
      if (result) {
        setLoadinglistvm(false)
        setListuser(result?.data);
      } else {
        setLoadinglistvm(true)
      }
    }
    getListUser();
  }
  }, [props.visible]);
 
  const [, setExpandedKeys] = useState([]);
  const [, setCheckedKeys] = useState([]);
  const [, setSelectedKeys] = useState([]);


  const onCheck = (checkedKeysValue) => {
    let volumeIdList = [];

    checkedKeysValue.map((element, index) => {
      const words = element;
      let obj = {
        id: words,
        vm_id: words,
       
      };
      if (
        obj?.id !== null &&
        (typeof obj?.id === "string" || obj?.id instanceof String)
      ) {
        const item = obj?.id.split("~");
        let itemVm = {
          id: item[0],
          vm_id: item[1],
          name: item[2],
         
        };
        volumeIdList.push(itemVm);
      }
      return element;
    });
    setCheckedKeys(checkedKeysValue);
    form.setFieldsValue({
      volumes: volumeIdList,
    });
  };

  const handleOk = async (items) => {
    const a = arrChecked;
    let volumes = items?.volumes?.filter((item) => !Boolean(Number(item)));
    const newVolumes = volumes?.map((item) => {
      return {
        id: item?.id + "~" + item.vm_id + "~" + item.name,
      };
    });

    const paramVolumes = newVolumes.filter((e) =>
      a.every((n) => n.id !== e.id)
    );

    let volumeIdList = [];
    paramVolumes.map((element, index) => {
      if (
        element?.id !== null &&
        (typeof element?.id === "string" || element?.id instanceof String)
      ) {
        const item = element?.id.split("~");
        let itemVm = {
          id: item[0],
          vm_id: item[1],
          name: item[2],
        };
        volumeIdList.push(itemVm);
      }
      return element;
    });
    setLoading(true);
    try {
      const createData = await axiosClient.post(API.CREATE_GROUP_BACKUP, {
        name: items.name,
        volumes: volumeIdList,
        "user_id": form.getFieldValue('user_id'),
      });

      if (createData) {
        handleCancel();
        props.setReload((pre) => !pre);
        setExpandedKeys([]);
        setCheckedKeys([]);
        setSelectedKeys([]);
        message.success("Create Vm Group Success !!!");
      } 
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error?.response?.data?.errors?.[0]?.message)

    }
  };

  const handleCancel = () => {
    props.setVisible(false);
    form.resetFields();
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
  

  return (
    <Modal
      title="Create Volume Group"
      visible={props.visible}
      forceRender={true}
      footer={false}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOk}
        initialValues={{
          name: props?.groupbackup ? props?.groupbackup?.name : undefined,
          // description: props?.groupbackup ? props?.groupbackup?.description : undefined,
          vms: props?.groupbackup ? props?.groupbackup?.vms : undefined,
        }}
      >
          <Form.Item label="User" name="user" rules={[{ required: true, message: 'Please input User' }]}>
          <Select
            showSearch
            placeholder="Select a Username"
            className="form-control"
            optionFilterProp="children"
            onChange={(e) => onChangeUser(e)}
            onFocus={onFocus}
             onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {
                listuser?.map((item, key) => {
                  return (
                    <Option value={item?.id} key={key} disabled={item?.has_storage === false}>
                      {item?.user_name}
                    </Option>
                  );
                })}
          </Select>
          </Form.Item>
         
        <Form.Item
          name="name"
          label=" Group Name"
          rules={[{ required: true, message: "Please enter a Group name!" }]}
        >
          <Input placeholder="Enter group name" />
        </Form.Item>

        <Form.Item name="volumes">
          <h4> Volume Choices: </h4>
          {loadingListVm ? (
            <Spin />
          ) : (
            <Tree
              checkable
              defaultExpandedKeys={idKeyDefaultCheckbox}
              defaultSelectedKeys={idKeyDefaultCheckbox}
              defaultCheckedKeys={idKeyDefaultCheckbox}
              onCheck={onCheck}
              treeData={volumeList}
              loadingListVm={loadingListVm}
            />
          )}
          {/* {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
           <Pagination className="paginationV" defaultCurrent={1} total={50} pagination={pagination} onChange={handleVolumeChange} />
          )} */}
        </Form.Item>
        <Form.Item className="right-btn" {...layout}>
          <Button
            className={cls("btn-next", "mr-10")}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Create
          </Button>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroup;
