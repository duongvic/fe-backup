import React, {  useEffect, useState  } from 'react';
import { Table, Button, message, Tooltip, Modal } from 'antd';
import "antd/dist/antd.css";
import { EditOutlined, PlusCircleOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import StorageForm from './Storage.Form';
import axiosClient from "api/axiosClient";
import storageApi from "api/storageApi";
import { API } from 'const';
import Createstorage from './Createstorage';
const { Column } = Table;
const { confirm } = Modal;
function ListStorage() {
  // const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 11,
    showQuickJumper: true,
  });
  const [filterOption, setFilterOption] = useState();
  const [liststorage, setListstorage] = useState([]);
  const [reload, setReload] = useState(false);
  const [storage, setStorage] = useState({});
  const [openModel, setOpenModel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [createstorage, setCreatestorage] = useState({});
  // const [listAllowed, setListAllowed] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleTableChange = async (pageChange) => {
    const response = await axiosClient.get(API.LIST_STORAGES + `?page=${pageChange.current}&page_size=${pageChange.pageSize}`) 
      if(response) {
        setListstorage(response?.data);
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
    const fetchProductList = async () => {
      const response = await axiosClient.get(API.LIST_STORAGES + `?page=${pagination.current}&page_size=${pagination.pageSize}`) 
      if(response) {
        setListstorage(response?.data);
        setPagination({
          ...pagination,
          total:
          response?.has_more
              ? response?.data?.length + pagination.current * pagination.pageSize
              : pagination.current * pagination.pageSize,
        });
      } else {
        setListstorage([]);
        message.error(response?.message);
      }
    }
    fetchProductList();
  }, [reload]);

  const showDetail = (record) => {
    setOpenModel(true);
    setStorage(record);
    setLoading(false)
  }
  const handleDelete = async (item) => {
    try {
      const deleteId = item.id;
    const delData = await storageApi.delItem(+deleteId);
    if (delData) {
      setReload(pre => !pre);
      message.success("Policy deleted successfully.");
    }
    } catch (error) {
      message.error(error?.response?.data?.errors?.[0]?.message);
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
      <Button className="mar-12" onClick={() => {
        setCreatestorage({})
        setOpenModal(true);
      }}> {" "}<PlusCircleOutlined /> Create Storage</Button>

      <Table
        dataSource={liststorage}
        pagination={pagination}
        onChange={handleTableChange}>
        <Column
          title="Index"
          dataIndex="id"
          key="id"
        />
        <Column
          title="Storage Name"
          dataIndex="name"
          key="name"
        />
        <Column
          title="Disk Allowed (GB)"
          dataIndex="disk_allowed"
          key="disk_allowed"
          render={(text, record) => {
            return record?.disk_allowed / 1024 /1024 / 1024 
            
          }}
        />
        <Column
          title="Action"
          dataIndex="action"
          key="action"
          width={100}
          fixed="right"
          render={(e, record) => {
            return (
              <div>
                <span
                  style={{ marginRight: 16, color: "#1890ff" }}
                  onClick={() => {
                    showDetail(record)
                  }}
                >
                  <Tooltip title="Edit">
                    <EditOutlined />
                  </Tooltip>
                </span>
                <span
                  style={{ marginRight: 16, color: "#ff0000" }}
                  onClick={(e = () => showConfirm(record))}>
                    <DeleteOutlined />
                </span>
              </div>
            );
          }}
        />
        
      </Table>
      <StorageForm
        setReload={setReload}
        storage={storage}
        visible={openModel}
        setVisible={setOpenModel} />
      <Createstorage
        setReload={setReload}
        createstorage={createstorage}
        visible={openModal}
        setVisible={setOpenModal} />
    </div>
  );
}

export default ListStorage;
