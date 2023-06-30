import React, { useEffect, useState, useRef } from "react";
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
const GroupBackupForm = (props) => {
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
  const [idKeyCheckbox, setIdKeyCheckbox] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [filterOption, setFilterOption] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 10,
    showQuickJumper: true,
  }); 


  const handleVolumeChange = async (pageChange) => {
    
    const response = await axiosClient.get(API.LIST_VM + `?page=${pageChange ? pageChange : 1 }&page_size=1000`);
    if (response) {
      let vmList = [];
              for (const item of response?.data) {
                if (item.volumes !== null) {
                  vmList.push(item);
                }
              }
              let treeData = vmList?.map((item) => {
                return {
                  title: item.name,
                  key: item.id,
                  children: vmList.map((element, index) => {
                    let name =
                      element.name === null || element.name === ""
                        ? element.id
                        : element.name;
                    return {
                      title:  name + "-" + element.size + "GB",
                      key: element.id + "_" + item.id,
                      disabled: element.disabled === false ? element.disabled : element.in_group,
                    };
                  }),
                };
              });
              setVolumeList(treeData);
              setLoadingListVm(false);
      setFilterOption({
        ...filterOption,
        page: pageChange.current,
      });
      setPagination({
        ...pagination,
        total:
        response?.has_more
            ? response?.data?.length + pageChange.current * pageChange.pageSize
            : pageChange.current * pageChange.pageSize,
        current: pageChange.current,
      });
    }
  };
  useEffect(() => {
    if (props.visible === true) {
      async function fetchGroupid() {
        const idGroup = props?.groupbackup?.id;
        let response = await axiosClient.get(API.GET_GROUP_ID + '/' + idGroup)
        if(response){
        
          const a = response?.volumes?.map((item) =>{
            return {
              idChecked: item?.volume_id + "_" + item?.vm_id
            }
          })
          
          const b = a?.map((item) => {
            return item['idChecked'];
          });
          const bb = response?.user_id;
          setIdKeyCheckbox(b);
          const getListVm = async () => {
            let cc = bb
            setLoadingListVm(true);
            const result = await axiosClient.get(API.LIST_VM + `?user_id=${cc}`);
            if (result) {
              form.setFieldsValue({ user_id: cc });
              let vmList = [];
              for (const item of result?.data) {
                if (item.volumes !== null) {
                  vmList.push(item);
                }
              }
              let treeData = vmList?.map((item) => {
                let volumes = item?.volumes;
                let vols = volumes.map((element) => {
                  for (let i=0; i < b.length; i++) {
                    if (b[i].split("_")[0] === element.id) {
                      return {...element, disabled: false}
                    }
                  }
                  return {...element, disabled: true}
                })
                return {
                  title: item.name,
                  key: item.id,
                  children: vols.map((element, index) => {
                    let name =
                      element.name === null || element.name === ""
                        ? element.id
                        : element.name;
                    return {
                      title: name + "-" + element.size + "GB",
                      key: element.id + "_" + item.id,
                      disabled: element.disabled === false ? element.disabled : element.in_group,
                    };
                  }),
                };
              });
              setVolumeList(treeData);
              setLoadingListVm(false);
            
              setPagination({
                ...pagination,
                total:
                result.has_more
                    ? result.data.length + pagination.current * pagination.pageSize
                    : pagination.current * pagination.pageSize,
              });
            } else {
              setVolumeList([]);
              setLoadingListVm(false);
            }
          };
          getListVm();
        }
      }
      fetchGroupid();
    }
  },[props.visible, props.pagination]);
  // const onChangeUser = async (valueUser) => {
  //   setLoadingListVm(true);
  //   const result = await axiosClient.get(API.LIST_VM + `?user_id=${valueUser}`);
  //   if (result) {
  //     form.setFieldsValue({ user_id: valueUser });
  //     let vmList = [];
  //     for (const item of result?.data) {
  //       if (item.volumes !== null) {
  //         vmList.push(item);
  //       }
  //     }
  //     let treeData = vmList?.map((item) => {
  //       const volumes = item?.volumes;
  //       return {
  //         title: item.name,
  //         key: item.id,
  //         children: volumes.map((element, index) => {
  //           let name =
  //             element.name === null || element.name === ""
  //               ? element.id
  //               : element.name;
  //           return {
  //             title:  name + "-" + element.size + "GB",
  //             key: element.id + "_" + item.id,
  //             disabled: element.in_group,
  //           };
  //         }),
  //       };
  //     });
  //     setVolumeList(treeData);
  //     let arrChecked = [];
  //     for (let i = 0; i < treeData?.length; i++) {
  //       for (let j = 0; j < treeData?.[i].children?.length; j++) {
  //         let obj = {};
  //         if (treeData[i]?.children?.[j]?.disabled === true) {
  //           obj.id = treeData[i]?.children?.[j]?.key;
  //           // obj.vm_id = `${treeData[i]?.key}`;
  //           arrChecked.push(obj);
  //         }
  //       }
  //     }
  //     const newArrChecked = arrChecked?.map((item) => {
  //       return item["id"];
  //     });
  //     setIdKeyDefaultCheckbox(newArrChecked);
  //     setArrChecked(arrChecked);
  //     setLoadingListVm(false);
  //   } else {
  //     setVolumeList([]);
  //     setLoadingListVm(false);
  //   }
  // }; 

// useEffect(() => {
//   if (props.visible === true) {
//   const getListUser = async () => {
//     setLoadinglistvm(true)
//     const result = await axiosClient.get(API.USER_MANAGER)  
//     if (result) {
//       setLoadinglistvm(false)
//       setListuser(result?.data);
//     } else {
//       setLoadinglistvm(true)
//     }
//   }
//   getListUser();
// }
// }, [props.visible]);
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
        const item = obj?.id.split("_");
        let itemVm = {
          id: item[0],
          vm_id: item[1],
        };
        volumeIdList.push(itemVm);
      }
      return element;
    });

    form.setFieldsValue({
      volumes: volumeIdList,
    });
  };

  const handleOk = async (items) => {
    try {
      let volumes = items?.volumes?.filter((item) => !Boolean(Number(item)));
      const postData = await axiosClient.put(API.UPDATE_GROUP_BACKUP + "/" + props.groupbackup.id,
      {
        name: items.name,
        volumes: volumes,
      }
    );
    if (postData) {
      handleCancel();
      props.setReload(pre => !pre);
      message.success("Edit Vm Group success.");
    }
    setLoading(false);
    } catch (error) {
      message.error(error?.response?.data?.errors?.[0]?.message)

    }
  };
  const handleCancel = () => {
    props.setVisible(false);
    // form.resetFields();
  };

  return (
    <Modal
      title={`Edit Volume Group: ${props?.groupbackup?.user_name}_${props?.groupbackup?.name}`}
      visible={props.visible}
      forceRender={true}
      footer={false}
      onCancel={handleCancel}>
      {loadingListVm ? (
        <Spin />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}>
            {/* <Form.Item label="User" name="user" rules={[{ required: true, message: 'Please input User' }]}>
          <Select
            showSearch
            placeholder="Select a Username"
            className="form-control"
            optionFilterProp="children"
            onChange={(e) => onChangeUser(e)}
            onPopupScroll={onPopupScrollUser}
            onFocus={onFocus}
            // onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {
                listuser?.map((item, key) => {
                  return (
                    <Option value={item?.user_id} key={key}>
                      {item?.user_name}
                    </Option>
                  );
                })}
          </Select>
          </Form.Item> */}
          <Form.Item
            name="name"
            label=" Group Name"
           
          >
            <Input
              placeholder="Enter group name"
              defaultValue={props?.groupbackup?.name}
              allowClear
            />
          </Form.Item>
          <Form.Item name="volumes">
            <h4> Volume Choices: </h4>
            <Tree
              checkable
              defaultExpandedKeys={idKeyCheckbox}
              defaultSelectedKeys={idKeyCheckbox}
              defaultCheckedKeys={idKeyCheckbox}
              onCheck={onCheck}
              treeData={volumeList}
              loadingListVm={loadingListVm}
            />
            {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
            <Pagination className="paginationV" defaultCurrent={1} total={50} pagination={pagination} onChange={handleVolumeChange} />
            )}
          </Form.Item>

          <Form.Item className="right-btn" {...layout}>
            <Button
              className={cls("btn-next", "mr-10")}
              loading={loading}
              type="primary"
              htmlType="submit"
            >
              {props.mode === "create" ? "Create" : "Save"}
            </Button>
            <Button htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};


export default GroupBackupForm;
