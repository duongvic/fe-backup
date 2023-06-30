import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Input,
  message,
  Modal,
  Space,
  Spin,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { DeleteOutlined } from "@ant-design/icons";
import axiosClient from "api/axiosClient";
import { setConditions, API } from "const";
import moment from "moment";
const { confirm } = Modal;

const TableBackupUser = (props) => {
  const columns2 = [
    {
      title: "VM",
      key: "vm_name",
      width: "10%",
      render: (item) => item?.vm_name,
    },
    {
      title: "Volume",
      render: (text, record) => {
        return (
          <>
            {record?.name ||
              record?.volume?.split("-").reverse().slice(0, 1)[0]}
          </>
        );
      },
    },

    {
      title: "Policy Name",
      key: "job_name",
      render: (item) => item?.job_name,
    },
    {
      title: "Backup Version",
      key: "uid",
      // width: '15%',
      render: (item) => item.uid?.split("-").reverse().slice(0, 1)[0],
    },

    {
      title: "Created",
      key: "created_at",
      render: (item) => item?.created_at,
    },
    {
      title: "Expiration",
      key: "expired_at",
      render: (item) => item?.expired_at,
    },

     {
      title: "State",
      key: "status",
      // width: '15%',
      render: (text, record) => {
        if (record.status === 1) {
          return "incomplete";
        }
        if (record.status === 2) {
          return "valid";
        }
        if (record.status === 3) {
          return "invalid";
        }
      },
    },
    {
      title: "Allocated size",
      key: "size",
      render: (item) => item?.size,
    },
    {
      title: "Actions",
      key: "action",
      render: (e, record) => (
        
        <Space size="middle">
          <Button
            disabled={
              record?.status === 1 ||
              (record?.status === 3 && record?.size !== record?.version?.size)
                ? true
                : false
            }
            className="restore-btn"
            onClick={(e = () => showConfirmRestore(record))}
            hidden={record.hidden}
          >
            Restore
          </Button>
          <Button
            className="btn-delete"
            onClick={(e = () => showConfirm(record))}
            hidden={record.hidden}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  

  const [form] = Form.useForm();
  const [filterOption, setFilterOption] = useState({});
  const [listBackupUser, setListBackupUser] = useState([]);
  const [loadingbackup, setLoadingbackup] = useState();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 10,
    showQuickJumper: true,
  });
  const handleTableChange = async (pageChange) => {
    setLoadingbackup(true);
    let dataSource = [];
    const response = await axiosClient.get(
      API.LIST_BACKUP.concat(
        `?page=${pageChange.current}&page_size=${pageChange.pageSize}`
      )
    );
    if (response) {
      setListBackupUser(response?.data);
      setLoadingbackup(false);
      let backupList = response.data ? response.data : [];
      if (backupList?.length > 0) {
        dataSource = backupList?.map((item) => {
          
          return {
            key: item?.vm_id,
            vm_name: item?.vm_name,
            hidden: true,
            children: item?.volumes.map((volume, index) => {
              return {
                volume: volume?.id,
                name: volume?.name,
                hidden: true,
                children: volume?.versions.map((version, index) => {
                  
                  return {
                    id: version?.id,
                    uid: version?.uid,
                    job_name: version?.job_name,
                    created_at: version?.created_at,
                    expired_at: version?.expired_at,
                    status: version?.status,
                    size: version?.size / 1024 / 1024 / 1024 + " ".concat("GB"),
                    hidden: false,
                  };
                }),
              };
            }),
          };
        });
      }
      setListBackupUser(dataSource);
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
    }
  };

  useEffect(() => {
    let dataSource = [];
    setLoadingbackup(true);
    const fetchProductList = async () => {
      const response = await axiosClient.get(
        API.LIST_BACKUP +
          `?page=${pagination.current}&page_size=${pagination.pageSize}`
      );
      if (response) {
        setListBackupUser(response?.data);
        setLoadingbackup(false);
        let backupList = response.data ? response.data : [];
        if (backupList?.length > 0) {
          dataSource = backupList?.map((item) => {
            return {
              key: item?.vm_id,
              vm_name: item?.vm_name,
              hidden: true,
              children: item?.volumes.map((volume, index) => {
                // let nameVolume = volumes.volume_name === null || volumes.volume_name === "" ? volumes.volume_id: volumes.volume_id;
                return {
                  // title: nameVolume,
                  volume: volume?.id,
                  name: volume?.name,
                  hidden: true,
                  children: volume?.versions.map((version, index) => {
                    return {
                      id: version?.id,
                      uid: version?.uid,
                      job_name: version?.job_name,
                      created_at: version?.created_at,
                      expired_at: version?.expired_at,
                      status: version?.status,
                      size: version?.size / 1024 / 1024 / 1024 + " " + "GB",
                      hidden: false,
                    };
                  }),
                };
              }),
            };
          });
        }
        setListBackupUser(dataSource);
        setPagination({
          ...pagination,
          total: response?.has_more
            ? response?.data?.length + pagination.current * pagination.pageSize
            : pagination.current * pagination.pageSize,
        });
      } else {
        setListBackupUser([]);
        message.error(response?.message);
      }
    };
    setLoadingbackup(true);
    fetchProductList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const getA = async (e) => {
    let dataSource = [];
    const params = e;
    const createDate = e?.from
      ? moment(e?.from?._d).format("YYYY-MM-DD")
      : undefined;

    const condition = setConditions({ ...params, from: createDate });
    setLoading(true);

    const response = await axiosClient.get(
      `${API.LIST_BACKUP}?${condition}&page=1&page_size=150`
    );

    if (response) {
      const red = response?.data;
      setListBackupUser(red);
      let backupList = response.data ? response.data : [];
      if (backupList?.length > 0) {
        dataSource = backupList?.map((item) => {
          return {
            key: item?.vm_id,
            vm_name: item?.vm_name,
            hidden: true,
            children: item?.volumes.map((volume, index) => {
              return {
                volume: volume?.id,
                key: volume?.id,
                hidden: true,

                children: volume?.versions.map((version, index) => {
                  return {
                    id: version?.id,
                    uid: version?.uid,
                    job_name: version?.job_name,
                    created_at: version?.created_at,
                    expired_at: version?.expired_at,
                    status_name: version?.status_name,
                    deleted: version?.deleted,
                    size: version?.size / 1024 / 1024 / 1024 + " ".concat("GB"),
                    hidden: false,
                  };
                }),
              };
            }),
          };
        });
      }
      setListBackupUser(dataSource);
      setLoading(false);
      setPagination({
        ...pagination,
        total: response?.has_more
          ? response.data.length + pagination.current * pagination.pageSize
          : pagination.current * pagination.pageSize,
      });
    } else {
      setListBackupUser([]);
      message.error(response?.message);
      setLoading(false);

    }
    // .catch((error) => {
    //   message.error(error?.response?.statusText);
    // });
  };
  const handleFilter = async (e) => {
    await getA(e);
  };
  const handleRestore = async (item) => {
    try {
      const restoreId = item.id;
      const params = {
        force: true,
        wait: false,
      };
      const resData = await axiosClient.post(API.RESTORE_BACKUP + "/" + restoreId , params);
      if (resData?.data === null) {
        message.success("Restore success !!!");
      }
    } catch (error) {
      message.error("Restore faild !!!");
    }
  };
  const handleDelete = async (item) => {
    const deleteId = item.id;
    const delData = await axiosClient.delete(API.DELETE_BACKUP + "/" + deleteId);
    if (delData?.status === 200) {
      // setReload((pre) => !pre);
      message.success("Delete Backup success !!!");
      setLoading(false);
    } else {
      message.error("Delete Backup faild !!!");
      setLoading(false);
    }
  };
  function showConfirm(e) {
    confirm({
      title: "Are you sure you want to delete?",

      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(e);
      },
      onCancel() {},
    });
  }
  function showConfirmRestore(e) {
    confirm({
      title: "Are you sure you want to restore?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleRestore(e);
      },
      onCancel() {},
    });
  }
  return (
    <div className="chart-tq back-all">
      <div className="field-backup">
        <Form form={form} onFinish={handleFilter} layout="inline">
          {/* <Form.Item name="from" label="Created">
            <DatePicker format={"DD-MM-YYYY"} />
          </Form.Item> */}
          {/* <Form.Item name="to" label="to"><DatePicker placeholder="Choose a date" style={{ width: '200px' }} format={dateFormat} /></Form.Item> */}
          <Form.Item name="vm_name" label="VM" placeholder="vm name">
            <Input placeholder="Search Vm" />
          </Form.Item>
          {/* <Form.Item name="volume_id" label="Volume">
            <Input placeholder="Search volume" />
          </Form.Item> */}
          <Button
            className="btn-next"
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Search
          </Button>
        </Form>
      </div>

      {loadingbackup ? (
        <>
          <Spin tip="Loading...">
            <Table
              columns={columns2}
              dataSource={listBackupUser}
              onChange={handleTableChange}
              pagination={pagination}
            ></Table>
          </Spin>
        </>
      ) : (
        <>
          <Table
            columns={columns2}
            dataSource={listBackupUser}
            onChange={handleTableChange}
            pagination={pagination}
          ></Table>
        </>
      )}
    </div>
  );
};

export default TableBackupUser;
