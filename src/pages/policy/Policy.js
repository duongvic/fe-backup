import React, { useEffect, useState, Fragment } from "react";
import { Table, message, Button, Modal, Tooltip, Form, Input } from "antd";
import "antd/dist/antd.css";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import policyApi from "api/policyApi";
import PolicyForm from "./Policy.Form";
import Createpolicy from "./Createpolicy";
import UserPolicy from "./UserPolicy";
import { setSearchPolicy, API } from "const";
import axiosClient from "api/axiosClient";
// import { getDayevery } from "const";
const { Column } = Table;
const { confirm } = Modal;
function Policy() {
  // const dispatch = useDispatch();
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
  const [filterOption, setFilterOption] = useState();
  const [listpolicy, setListpolicy] = useState([]);
  const [reload, setReload] = useState(false);
  const [policy, setPolicy] = useState({});
  const [createpolicy, setCreatePolicy] = useState({});
  const [userpolicy, setUserPolicy] = useState({});
  const [openModall, setOpenModall] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTableChange = async (pageChange) => {
    const response = await axiosClient.get(API.LIST_POLICY + `?page=${pageChange.current}&page_size=${pageChange.pageSize}`) 
      if(response) {
        setListpolicy(response?.data);
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
  useEffect(() => {
    const fetchPolicyList = async () => {
      const response = await axiosClient.get(
        API.LIST_POLICY +
          `?page=${pagination.current}&page_size=${pagination.pageSize}`
      );
      if (response) {
        const resp = response?.data;
        setListpolicy(resp);
        setPagination({
          ...pagination,
          total:
          response?.has_more
              ? response?.data?.length + pagination.current * pagination.pageSize
              : pagination.current * pagination.pageSize,
        });
      } else {
        setListpolicy([]);
        message.error(response?.message);
      }
    };
    fetchPolicyList();
  }, [reload]);

  const getA = async (e) => {
    const params = e;
    const condition = setSearchPolicy({ ...params });
    setLoading(true);
    const response = await axiosClient.get(API.LIST_POLICY + `?${condition}`);
    if (response) {
      const red = response?.data;
      setListpolicy(red);
    } else {
      setListpolicy([]);
      message.error(response?.message);
    }
    setLoading(false);
  };
  const handleFilter = async (e) => {
    await getA(e);
  };
  const handleDelete = async (item) => {
    const deleteId = item.id;
    const delData = await policyApi.delItem(+deleteId);
    if (delData) {
      setReload(pre => !pre);
      message.success("Policy deleted successfully.");
    } else {
      message.error("Failed to delete policy.");
    }
  };

  function showConfirm(e) {
    confirm({
      title: "Are you sure you want to delete?",
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
          setCreatePolicy({});
          setOpenModal(true);
        }}
        >
        {" "}
        <PlusCircleOutlined /> Create Policy
      </Button>
       )}
       {userInfo && userInfo?.role?.toUpperCase() === "USER" && (
      <Button
        className="mar-12"
        onClick={() => {
          setUserPolicy({});
          setOpenModall(true);
        }}
      >
        {" "}
        <PlusCircleOutlined /> Create Policy
      </Button>
       )}
      {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
        <div className="field-backup">
          <Form
            form={form}
            name="global_state"
            onFinish={handleFilter}
            layout="inline"
          >
            <Form.Item
              name="user_name"
              label="User name"
              rules={[{ required: true, message: "Please input user name!" }]}
            >
              <Input placeholder="Search username" />
            </Form.Item>
            <Button className="btn-next" type="primary" htmlType="submit">
              Search
            </Button>
          </Form>
        </div>
      )}

      <Table
        dataSource={listpolicy}
        pagination={pagination}
        onChange={handleTableChange}
      >
        <Column title="Index" dataIndex="id" key="id" />
        <Column title="User Name" dataIndex="user_name" key="user_name" />
        {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
          <Column title="Policy Name" dataIndex="name" key="name" />
        )}
        <Column
          title="Backup Group"
          key="type"
          render={(text, record) => {
            return <span>{record?.group_name}</span>;
          }}
        />
        <Column
          title="Backup Days"
          key="type"
          render={(text, record) => {
            return (
              <Fragment>
                {Array.isArray(record?.days_of_week)
                  ? record?.days_of_week.map((item) => (
                      <span className="tag-group mr-6">
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </span>
                    ))
                  : record?.days_of_week
                      .split(",")
                      .map((item) => (
                        <span className="tag-group mr-6">
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                      ))}
              </Fragment>
            );
          }}
        />
        <Column
          title="Time"
          dataIndex="start_time"
          key="start_time"
          render={(text, record) => {
            return record?.start_time?._isAMomentObject
              ? record?.start_time._i
              : `${String(Math.floor(record?.start_time / 60)).padStart(
                  2,
                  "0"
                )}:${String(record?.start_time % 60).padStart(2, "0")}`;
          }}
        />
        <Column title="Retention" dataIndex="retention" key="retention" />
        <Column
          title="Action"
          dataIndex="action"
          key="action"
          width={100}
          fixed="right"
          render={(e, record) => {
            return (
              <div>
                <span>
                  <a
                  style={{ marginRight: 16, color: "#1890ff" }}
                  onClick={() => {
                    setPolicy(record);
                    setOpenModel(true);
                  }}
                >
                  <Tooltip title="Edit">
                    <EditOutlined />
                  </Tooltip>
                  </a>
                </span>
                <span>
                  <a className="red" onClick={(e = () => showConfirm(record))}>
                  <DeleteOutlined />
                  </a>
                </span>
                {/* <a className="red" onClick={showConfirm} >
                    <DeleteOutlined />{" "}
                  </a> */}
              </div>
            );
          }}
        />
      </Table>
      <PolicyForm
        setReload={setReload}
        policy={policy}
        visible={openModel}
        setVisible={setOpenModel}
      />
      <Createpolicy
        setReload={setReload}
        createpolicy={createpolicy}
        visible={openModal}
        setVisible={setOpenModal}
      />
      <UserPolicy
        setReload={setReload}
        userpolicy={userpolicy}
        visible={openModall}
        setVisible={setOpenModall}
      />
    </div>
  );
}

export default Policy;
