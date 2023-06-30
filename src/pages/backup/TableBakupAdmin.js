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
// import backupApi from "api/backupApi";
import axiosClient from "api/axiosClient";
import { setConditions, API } from "const";
import moment from "moment";

const { confirm } = Modal;
const TableBakupAdmin = () => {
  const columns = [
    {
      title: "Username",
      key: "user_name",
      width: "10%",
      render: (item) => item?.user_name,
    },

    {
      title: "VM",
      key: "vm_name",
      width: "10%",
      render: (item) => item?.vm_name,
    },
    {
      title: "Policy Name",
      key: "Policy Name",
      // width: '15%',
      render: (item) => item?.job_name,
    },
    {
      title: "Volume",
      render: (item) => item?.volume,

      // render: (text, record) => {
      //   return (
      //     <>
      //       {record?.name?.split("-").reverse().slice(0, 1)[0] ||
      //         record?.volume?.split("-").reverse().slice(0, 1)[0]}
      //     </>
      //   );
      // },
    },
    {
      title: "Backup version",
      key: "uid",
      // width: '15%',
      render: (item) => item.uid?.split("-").reverse().slice(0, 1)[0],
    },

    {
      title: "Created",
      key: "created_at",
      // width: '15%',
      render: (item) => item?.created_at,
    },
    {
      title: "Expried",
      key: "expired_at",
      // width: '15%',
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
      // width: '15%',
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
            className="red"
            onClick={(e = () => showConfirm(record))}
            hidden={record.hidden}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const [userInfo, setUserInfo] = useState();
  const [form] = Form.useForm();
  const [filterOption, setFilterOption] = useState({});
  const [listBackup, setListBackUp] = useState([]);
  const [loadingbackup, setLoadingbackup] = useState();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 10,
    showQuickJumper: true,
  });
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);
  const handleTableChange = async (pageChange) => {
    let dataSource = [];
    setLoadingbackup(true);
    const response = await axiosClient.get(
      API.LIST_BACKUP +
        `?page=${pageChange.current}&page_size=${pageChange.pageSize}`
    );
    if (response) {
      setLoadingbackup(false);
      setListBackUp(response?.data);
      let backupList = response.data ? response.data : [];
      if (backupList?.length > 0) {
        dataSource = backupList?.map((item) => {
          return {
            key: item?.user_name,
            user_name: item?.user_name,
            hidden: true,
            children: item?.vms?.map((vms, index) => {
              return {
                key: vms?.vm_id,
                vm_name: vms?.vm_name,
                hidden: true,
                children: vms?.volumes.map((volumes, index) => {
                  return {
                    volume: volumes?.id,
                    name: volumes?.name,
                    hidden: true,
                    children: volumes?.versions.map((version, index) => {
                      return {
                        id: version?.id,
                        uid: version?.uid,
                        job_name: version?.job_name,
                        created_at: version?.created_at,
                        expired_at: version?.expired_at,
                        status: version?.status,
                        deleted: version?.deleted,
                        size:
                          version?.size / 1024 / 1024 / 1024 + " ".concat("GB"),
                        hidden: false,
                      };
                    }),
                  };
                }),
              };
            }),
          };
        });
      }
      setListBackUp(dataSource);
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

    setLoadingbackup(false);
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
        setLoadingbackup(false);
        setListBackUp(response?.data);
        let backupList = response.data ? response.data : [];
        if (backupList?.length > 0) {
          dataSource = backupList?.map((item) => {
            return {
              key: item?.user_name,
              user_name: item?.user_name,
              hidden: true,
              children: item?.vms?.map((vms, index) => {
                return {
                  key: vms?.vm_id,
                  vm_name: vms?.vm_name,
                  hidden: true,
                  children: vms?.volumes.map((volumes, index) => {
                    return {
                      volume: volumes?.id,
                      name: volumes?.name,
                      hidden: true,
                      children: volumes?.versions.map((version, index) => {
                        return {
                          id: version?.id,
                          uid: version?.uid,
                          job_name: version?.job_name,
                          created_at: version?.created_at,
                          expired_at: version?.expired_at,
                          status: version?.status,
                          deleted: version?.deleted,
                          size:
                            version?.size / 1024 / 1024 / 1024 +
                            " ".concat("GB"),
                          hidden: false,
                        };
                      }),
                    };
                  }),
                };
              }),
            };
          });
        }
        setListBackUp(dataSource);
        setPagination({
          ...pagination,
          total: response.has_more
            ? response.data.length + pagination.current * pagination.pageSize
            : pagination.current * pagination.pageSize,
        });
      } else {
        setListBackUp([]);
        message.error(response?.message);
      }
    };
    fetchProductList();
    setLoadingbackup(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const getA = async (e) => {
    try {
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
        setListBackUp(red);
        let backupList = response.data ? response.data : [];
        if (backupList?.length > 0) {
          dataSource = backupList?.map((item) => {
            return {
              key: item?.user_name,
              user_name: item?.user_name,
              hidden: true,
              children: item?.vms?.map((vms, index) => {
                return {
                  key: vms?.vm_id,
                  vm_name: vms?.vm_name,
                  hidden: true,
                  children: vms?.volumes.map((volumes, index) => {
                    return {
                      volume: volumes?.id,
                      name: volumes?.name,
                      hidden: true,
                      children: volumes?.versions.map((version, index) => {
                        return {
                          id: version?.id,
                          uid: version?.uid,
                          job_name: version?.job_name,
                          created_at: version?.created_at,
                          expired_at: version?.expired_at,
                          status: version?.status,
                          deleted: version?.deleted,
                          size: version?.size / 1024 / 1024 / 1024 + " " + "GB",
                          hidden: false,
                        };
                      }),
                    };
                  }),
                };
              }),
            };
          });
        }
        
        setListBackUp(dataSource);
        setPagination({
          ...pagination,
          total:
            red.has_more === true
              ? red.data.length + pagination.current * pagination.pageSize
              : pagination.current * pagination.pageSize,
        });
        setLoading(false);
      } else {
        setListBackUp([]);
        message.error(response?.message);
      }
    } catch (error) {
      setListBackUp([]);
      setLoading(false);
    }
  };

  const getB = async (e) => {
    try {
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
        setListBackUp(red);
        let backupList = response.data ? response.data : [];
        if (backupList?.length > 0) {
          dataSource = backupList?.map((item) => {
            
            return {
              key: item?.id,
              id: item?.id,
              hidden: true,
              children: item?.versions?.map((versions, index) => {
                return {
                  key: versions?.volume,
                  volume: versions?.volume,
               
                };
              }),
            };
          });
        }
        
        setListBackUp(dataSource);
        setPagination({
          ...pagination,
          total:
            red.has_more === true
              ? red.data.length + pagination.current * pagination.pageSize
              : pagination.current * pagination.pageSize,
        });
        setLoading(false);
      } else {
        setListBackUp([]);
        message.error(response?.message);
      }
    } catch (error) {
      setListBackUp([]);
      setLoading(false);
    }
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
      description: "aaaaaaa",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(e);
      },
      onCancel() {},
    });
  }
  function showConfirmRestore(e) {
    confirm({
      title: "Are you sure you want to Restore?",
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
          <Form.Item name="user_name" label="Username">
            <Input placeholder="Search Username" />
          </Form.Item>
          <Form.Item name="volume_id" label="Volume">
            <Input placeholder="Search volume" />
          </Form.Item>
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
          <Spin>
            <Table
              columns={columns}
              dataSource={listBackup}
              onChange={handleTableChange}
              pagination={pagination}
            ></Table>
          </Spin>
        </>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={listBackup}
            onChange={handleTableChange}
            pagination={pagination}
          ></Table>
        </>
      )}
    </div>
  );
};

export default TableBakupAdmin;
