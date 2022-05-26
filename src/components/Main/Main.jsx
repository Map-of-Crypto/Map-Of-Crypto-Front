import { TagOutlined, WalletOutlined, WechatOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import React from "react";
import Products from "../Products/Products";
import Purchases from "../Purchases/Purchases";
import { ChatRoom } from "../../pages/chatRoom";

const { Sider, Content } = Layout;

const items = [
  {
    label: <Link to="/products">Products</Link>,
    key: "/products",
    icon: <TagOutlined />,
  }, // remember to pass the key prop
  {
    label: <Link to="/purchases">Purchases</Link>,
    key: "/purchases",
    icon: <WalletOutlined />,
  },
  {
    label: <Link to="/chat">Chat Room</Link>,
    key: "/purchases",
    icon: <WechatOutlined />,
  }, // which is required
];

const Main = ({ address }) => {
  const location = useLocation();
  return (
    <div style={{ display: "flex", alignItems: "stretch", minHeight: "100vh" }}>
      <Layout>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items}
            selectedKeys={location.pathname}
            selectable
          />
        </Sider>
        <Content
          style={{
            padding: "24px",
            minHeight: 280,
          }}
        >
          <Routes exact path="/">
            <Route path="/products" element={<Products />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/chat" element={<ChatRoom address={address} />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
};

export default Main;
