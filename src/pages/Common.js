import React, { useState, useEffect } from "react";
import {BrowserRouter as Router,Switch,Route,Link,useHistory,} from "react-router-dom";
import Breadcrumb from 'components/BreadCrumb';
import { API } from 'const';
import Home from './Home';
import DashboardAD from './DashboardAD';
import Listbackup from './backup/Listbackup';
import Createpolixy from './policy/Createpolicy';
import Manualbackup from './backup/Manualbackup';
import Policy from './policy/Policy';
import Vmname from './groupVM/Vmname';
import Restore from './Restore';
import Login from './Login';
import ListUser from './userManager/ListUser';
import ResourceOver from './userManager/ResourceOver';
import ListStorage from './storage/ListStorage';
import Doashboarduser from './DoashboardUser';
import LOGO from '../images/ic-logo.png';
import { Layout, Menu, Dropdown, Avatar } from "antd";
import axiosClient from "api/axiosClient";
import "antd/dist/antd.css";
import "./main.css";
import {
  BorderOuterOutlined,
  PieChartOutlined,
  AlignLeftOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  DiffOutlined,
  UserOutlined,
  BarChartOutlined,
  FormOutlined,
  PlusCircleOutlined,
  SnippetsOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
// import "./App.css";
const { Header, Sider, Content, Footer } = Layout;
// const { Option } = Select;
const { SubMenu } = Menu;

const Common = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  let history = useHistory();
  // const [refreshtoken, setRefreshtoken] = useState();
  // const [username, setUsername] = useState([]);
  // const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState();

  // function handleChange(value) {
  //   console.log(`selected ${value}`);
  // }

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token == null) {
      history.push("/login");
    }
  }, []);

useEffect(() => {
  setTimeout(()=> {
    axiosClient.put(API.REFRESH_TOKEN)
    .then(function (response) {
    const b = response?.refresh_token;
    localStorage.getItem(b);
  })
  .catch(function (error) {
    history.push("/login");
  });
  }, 6000)
  }, [])
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);

  const menu = (
    <Menu>
      <Menu.Item>
        <Link onClick={logout}>Đăng xuất</Link>
      </Menu.Item>
    </Menu>
  );
  
  return (
    <div className="back-all">
      <Router>
        <Layout>
          <Header className="header">
            <div className="flex-around">
              <div className="logo">
                <a href="/"><img src={LOGO} alt="" /></a>
                
              </div>
              <h3 className="c-white text-bold">Backup Service</h3>
            </div>
            <Menu theme="dark" mode="horizontal" defaultselectedkeys={["2"]}>
            <div className="document">
                <a className="text-user" href="https://docs.fptvds.vn/s/c4hh313uh0lc9ct5ascg/service-documents/d/c6dkfm3uh0la34o4j52g/huong-dan-thao-tac-tren-portal-backup" target="_blank">
                  <QuestionCircleOutlined /> Trợ giúp</a>
              </div>
              <div className="ui-navigation navbar-right">
                <Avatar
                  style={{
                    backgroundColor: "#87d068",
                    marginRight: 10,
                  }}
                  icon={<UserOutlined />}
                />
                <Dropdown overlay={menu} trigger={['click']}>
                  <Link 
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    {user?.user_name}
                    <DownOutlined />
                  </Link>
                </Dropdown>
              </div>
              
            </Menu>
          </Header>
          <Layout>
            <Sider width={220} className="site-layout-background">
              <Menu
                className="top-20"
                theme="dark"
                defaultSelectedKeys={["0"]}
                mode="inline"
                defaultOpenKeys={["sub1"]}
              >
                {userInfo && userInfo?.role?.toUpperCase() === "USER" && (
                  <Menu.Item key={8} icon={<PieChartOutlined />}>
                    <Link to="/user_dashboard"> Overview</Link>
                  </Menu.Item>
                )}
                {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
                  <Menu.Item key={1} icon={<PieChartOutlined />}>
                    <Link to="/admin_dashboard">Overview</Link>
                  </Menu.Item>
                )}
                {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
                  <Menu.Item key={2} icon={<AlignLeftOutlined />}>
                    <Link to="/user_overview"> User Manager</Link>
                  </Menu.Item>
                )}

                <SubMenu
                  className="menu-scorl"
                  key="sub1"
                  icon={<BorderOuterOutlined />}
                  title="Backup"
                >
                  <Menu.Item key={3} icon={<BarChartOutlined />}>
                    <Link to="/version_backup">Versions</Link>
                  </Menu.Item>
                  <Menu.Item key={4} icon={<FormOutlined />}>
                    <Link to="/manual_backup">Manual</Link>
                  </Menu.Item>
                  <Menu.Item key={5} icon={<PlusCircleOutlined />}>
                    <Link to="/volume_groups">Groups</Link>
                  </Menu.Item>
                  <Menu.Item key={6} icon={<SnippetsOutlined />}>
                    <Link to="/policy">Policies</Link>
                  </Menu.Item>
                  {/* <Menu.Item key="7" icon={<BorderOuterOutlined />}><Link key="6" to="/createpolicy"> Create Policy</Link></Menu.Item> */}
                </SubMenu>
                {userInfo && userInfo?.role?.toUpperCase() === "ADMIN" && (
                  <SubMenu
                    className="menu-scorl"
                    key="sub2"
                    icon={<DiffOutlined />}
                    title="Node"
                  >
                    <Menu.Item key={9} icon={<CodeSandboxOutlined />}>
                      <Link to="/storage"> Storage</Link>
                    </Menu.Item>

                  </SubMenu>
                )}
                {/* <Menu.Item key={10} icon={<CodeSandboxOutlined />}><Link to="/restore"> Restore</Link></Menu.Item> */}

              </Menu>
       
            </Sider>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Breadcrumb />
              <Switch>
                <Route path="/user_dashboard">
                  <Doashboarduser />
                </Route>
                <Route path="/storage">
                  <ListStorage />
                </Route>
                {/* <Route path="/edit_user">
                  <EditUser />
                </Route> */}
                <Route path="/admin_dashboard">
                  <DashboardAD />
                </Route>
                <Route path="/user_overview">
                  <ListUser />
                </Route>
                <Route path="/resource_overview">
                  <ResourceOver />
                </Route>
                <Route path="/restore">
                  <Restore />
                </Route>
                {/* <Route exact path="/addvm">
                  <AddVM />
                </Route> */}
                <Route path="/volume_groups">
                  <Vmname />
                </Route>

                <Route path="/create_policy">
                  <Createpolixy />
                </Route>
                <Route path="/manual_backup">
                  <Manualbackup />
                </Route>
                <Route path="/version_backup">
                  <Listbackup />
                </Route>
                <Route path="/home">
                  <Home />
                </Route>
                <Route path="/policy">
                  <Policy />
                </Route>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
              </Switch>
            </Content>
          </Layout>
          <Footer className="footer-all" style={{ textAlign: "right" }}>
          © 2021 FPT Telecom International One Member Ltd Co. All Rights Reserved.
          </Footer>
        </Layout>
      </Router>
    </div>
  );
};

export default Common;
