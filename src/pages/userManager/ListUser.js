import React, { useEffect, useState  } from 'react';
import "antd/dist/antd.css";
import { Table, Form, Input, Button, message, Spin } from 'antd';
import { API, setSearchUser } from 'const';
import axiosClient from "api/axiosClient";
import ResourceOver from "./ResourceOver";
// import withReducer from 'store/withReducer';
// import reducer from 'routes/data/store/reducers';
// import { getListData } from '';

const { Column } = Table;


const  ListUser = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 10,
    showQuickJumper: true,
  });
  const [form] = Form.useForm();
  const [listuser, setListuser] = useState([]);
  const [filterOption, setFilterOption] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [loadinguser, setLoadinguser] = useState();
  const [resourceover, setResourceover] = useState({});
  const [openModel, setOpenModel] = useState(false);


  const handleTableChange = async (pageChange) => {
    const response = await axiosClient.get(API.USER_MANAGER + `?page=${pageChange.current}&page_size=${pageChange.pageSize}`) 
      if(response) {
        setListuser(response?.data);
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
    setLoadinguser(true);
    const fetchProductList = async () => {
      const response = await axiosClient.get(API.USER_MANAGER  + `?page=${pagination.current}&page_size=${pagination.pageSize}`) 
      if(response) {
        setListuser(response?.data);
        setLoadinguser(false);
        setPagination({
          ...pagination,
          total:
          response?.has_more
              ? response.data.length + pagination.current * pagination.pageSize
              : pagination.current * pagination.pageSize,
        });
      } else {
        setListuser([]);
        message.error(response?.message);
        setLoadinguser(true);
      }
    
    }
    fetchProductList();
  }, [reload]);

  const getA = async (e) => {
    try {
      const params = e;
      const condition = setSearchUser({ ...params });
      const response = await axiosClient.get(API.USER_MANAGER + `?${condition}` );
      setLoading(true);
        if(response){
          const red = response?.data;
          setListuser(red);
        } else {
          setLoading(false);
          setListuser([]);
          message.error(response?.message);
        }
      setLoading(false);
    } catch (error) {
      setListuser([]);
      setLoading(false);
    }
    
  };
  const handleFilter = async (e) => {
    await getA(e);
};
 

return (
    <div className="chart-tq back-all">
      <div className="field-backup">
        <Form
         form={form}
          onFinish={handleFilter}
          layout="inline">
          <Form.Item
            name="user_name"
            label="Usename"
            
          >
            <Input placeholder="Select Username" />
          </Form.Item>
          
          <Form.Item className="right-btn">
            <Button className="btn-next" loading={loading} type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>
      {loadinguser ? (
        <Spin />
      ) : (
      <Table 
          
          dataSource={listuser} 
          pagination={pagination} 
          onChange={handleTableChange}>
        <Column
          title="No"
          dataIndex="user_id"
          key="user_id"
        />
        <Column
          title="Username"
          dataIndex="user_name"
          key="user_name"
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
          title="Disk Used (GB)"
          dataIndex="disk_used"
          key="disk_used"
          render={(text, record) => {
            return (record?.disk_used / 1024 /1024 / 1024).toFixed(1) 
            
          }}
        />
        <Column
          title="Node"
          dataIndex="node_name"
          key="node_name"
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
                    setResourceover(record);
                    setOpenModel(true);
                   
                  }}
                >
                ResourceOver
                </span>
               
              </div>
            );
          }}
        />
        {/* <Column title="Action" dataIndex="action" key="action" width={100} fixed='right' render={(text, record) => {
          return <a href="/resource_overview">ResourceOver</a>
        }} /> */}
      </Table>
      )}
      <ResourceOver
        setReload={setReload}
        resourceover={resourceover}
        visible={openModel}
        setVisible={setOpenModel}
      />


    </div>
  );
}

export default ListUser;
