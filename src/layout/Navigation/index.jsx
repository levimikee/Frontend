import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { logout } from "../../auth/auth.service";
import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useSelector, useStore } from "react-redux";
import { selectCurrentAdmin } from "@/redux/auth/selectors";
const { Sider } = Layout;
const { SubMenu } = Menu;

function Navigation() {
  const [collapsed, setCollapsed] = useState(false);
  const {isRootUser}  = useSelector(selectCurrentAdmin);
   
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };


  const handleMenuClick = (e) => {
    if (e.key === "3") {
      logout();
    }
  };

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{
          zIndex: 1000,
        }}
      >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" onClick={handleMenuClick}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/upload-file" />
            Upload
          </Menu.Item>
         {isRootUser &&
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin" />
            User management
          </Menu.Item>}
          <Menu.Item key="3" icon={<LogoutOutlined />}>
              Logout
          </Menu.Item>

        </Menu>
      </Sider>
    </>
  );
}
export default Navigation;
