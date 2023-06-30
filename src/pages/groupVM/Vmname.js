import React, {  useEffect, useState  } from 'react';
import { Table, Button, Modal, message, Tooltip, Form, Input } from "antd";
import "antd/dist/antd.css";
import {PlusCircleOutlined, EditOutlined, DeleteOutlined,ExclamationCircleOutlined} from "@ant-design/icons";
import GroupBackupForm from "./GroupBackup.Form";
import GroupBackupFormUser from "./GroupBackupUser.Form";
import CreateGroup from "./CreateGroup";
import CreateGroupUser from "./CreateGroupUser";
import { API, setSearchGroup } from "const";
import axiosClient from "api/axiosClient";
// import groupApi from "api/groupApi";
// import StorageForm from './Storage.Form';
const { Column } = Table;
const { confirm } = Modal;

const Vmname = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 11,
    showQuickJumper: true,
  });
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);
  const [form] = Form.useForm();
  const [listgroup, setListgroup] = useState([]);
  const [filterOption, setFilterOption] = useState();
  const [reload, setReload] = useState(false);
  const [groupbackup, setGroupbackup] = useState({});
  const [groupbackupUser, setGroupbackupUser] = useState({});
  const [openModel, setOpenModel] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [openModell, setOpenModell] = useState(false);
  const [openModall, setOpenModall] = useState(false);
  const [loading, setLoading] = useState(false);

 
  const handleTableChange = async (pageChange) => {
    const response = await axiosClient.get(API.LIST_GROUP_BACKUP + `?page=${pageChange.current}&page_size=${pageChange.pageSize}`) 
      if(response) {
        setListgroup(response?.data);
        setFilterOption({
          ...filterOption,
          page: pageChange.current,
        });
        setPagination({
          ...pagination,
          total: response?.has_more
            ? response?.data?.length + pageChange.current * pageChange.pageSize
            : pageChange.current * pageChange.pageSize,
          current: pageChange.current,
        });
      };
  };
  const getA = async (e) => {
    let dataSource = [];
    const params = e;
    const condition = setSearchGroup({ ...params });
    setLoading(true);
    const response = await axiosClient.get(API.LIST_GROUP_BACKUP + `?${condition}&page=1&page_size=100` );
        if(response){
          setListgroup(response?.data);
        } else {
          setListgroup([]);
          message.error(response?.message);
        }
      setLoading(false);
  };
  const handleFilter = async (e) => {
    await getA(e);
  };
  useEffect(() => {
    const fetchProductList = async () => {
      const response = await axiosClient.get(API.LIST_GROUP_BACKUP + `?page=${pagination.current}&page_size=${pagination.pageSize}`);
      if(response) {
        setListgroup(response?.data);
        setPagination({
          ...pagination,
          total: response.has_more 
            ? response?.data?.length + pagination.current * pagination.pageSize
            : pagination.current * pagination.pageSize,
        });
      } else {
        setListgroup([]);
        message.error(response?.message);
      }
    }
    fetchProductList();
  }, [reload]);

  const handleDelete = async (item) => {
    const deleteId = item.id;
    const delData = await axiosClient.delete(API.DELETE_GROUP_BACKUP + '/' + deleteId);
    if (delData) {
      setReload(pre => !pre);
      message.success("Delete Vm Group success !!!");
    }
  };
  function showConfirm(e) {
    confirm({
      title: "Are you sure delete?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(e);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
  return (
    <div className="chart-tq back-all">
       {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
      <Button
        className="mar-12"
        onClick={() => {
          setGroupbackup({});
          setOpenModal(true);
        }}
       >
        {" "}
        <PlusCircleOutlined /> Create Group
      </Button>
       )}
       {userInfo && userInfo?.role?.toUpperCase() === "USER" && (
      <Button
        className="mar-12"
        onClick={() => {
          setGroupbackupUser({});
          setOpenModall(true);
        }}>
        {" "}
        <PlusCircleOutlined /> Create Group
      </Button>
      )}
      {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
      <div className="field-backup">
     
     <Form
         form={form}
         name="global_state"
         onFinish={handleFilter}
         layout="inline">
         <Form.Item
           name="user_name"
           label="Username" rules={[{ required: true, message: 'Please input user name!' }]}>
           <Input placeholder="Search Username" />
         </Form.Item>
           <Button className="btn-next"type="primary" htmlType="submit">
             Search
           </Button>
       </Form>
     </div>
     )}
      <Table
        dataSource={listgroup}
        pagination={pagination}
        onChange={handleTableChange}>
        <Column title="ID" dataIndex="id" key="id" />
        {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
        <Column title="User name" dataIndex="user_name" key="user_name" />
        )}
        <Column title="Group name" dataIndex="name" key="name" />
        <Column
          title="Volume"
          key="type"
          render={(text, record) => {
            if (!record.volumes || record.volumes.length <= 0) {
              return null;
            }
            if (record.volumes.length > 10) {
              let volume = record.volumes.slice(0, 4);
              return (
                <>
                  {volume.map((t, index) => (
                    <span key={index} className="tag-group mr-6">
                    { t?.volume_name?.slice(-12) || t.volume_id?.split("-").reverse().slice(0, 1)[0] }
                    </span>
                  ))}
                  ...
                </>
              );
            }
            return record.volumes.map((t, index) => (
              <span key={index} className="tag-group mr-6">
               
               {t?.volume_name?.slice(-12) || t?.volume_id?.split("-").reverse().slice(0, 1)[0]}
              </span>
            ));
          }}
        />
      
        {/* <Column title="Policy name" dataIndex="description" key="description" /> */}
        {userInfo && userInfo?.role?.toUpperCase() === "USER" && (
        <Column
          title="Action"
          dataIndex="action"
          key="action"
          width={100}
          fixed="right"
          render={(e, record) => {
            return (
              <span>
                <a
                  style={{ marginRight: 16 }}
                  onClick={() => {
                    setGroupbackupUser(record);
                    setOpenModell(true);
                  }}
                >
                  <Tooltip title="Edit">
                  <EditOutlined />
                  </Tooltip>
                 
                </a>
                <a className="red" onClick={(e = () => showConfirm(record))}>
                  <DeleteOutlined />
                </a>
              </span>
            );
          }}
        />
        )}
        {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
        <Column
          title="Action"
          dataIndex="action"
          key="action"
          width={100}
          fixed="right"
          render={(e, record) => {
            return (
              <span>
                <a
                  style={{ marginRight: 16 }}
                  onClick={() => {
                    setGroupbackup(record);
                    setOpenModel(true);
                  }}
                >
                  <Tooltip title="Edit">
                  <EditOutlined />
                  </Tooltip>
                 
                </a>
                <a className="red" onClick={(e = () => showConfirm(record))}>
                  <DeleteOutlined />
                </a>
              </span>
            );
          }}
        />
        )}
      </Table>
      <GroupBackupForm
        setReload={setReload}
        groupbackup={groupbackup}
        visible={openModel}
        setVisible={setOpenModel}
      />
       <CreateGroup
        setReload={setReload}
        groupbackup={groupbackup}
        visible={openModal}
        setVisible={setOpenModal}
      />
      <GroupBackupFormUser
        setReload={setReload}
        groupbackupUser={groupbackupUser}
        visible={openModell}
        setVisible={setOpenModell}
      />
      <CreateGroupUser
        setReload={setReload}
        groupbackupUser={groupbackupUser}
        visible={openModall}
        setVisible={setOpenModall}
      />
    </div>
  );
};

export default Vmname;