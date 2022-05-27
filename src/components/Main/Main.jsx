import {
  TagOutlined,
  WalletOutlined,
  WechatOutlined,
  PlusCircleOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import React, { useEffect } from "react";
import Products from "../Products/Products";
import Purchases from "../Purchases/Purchases";
import { ChatRoom } from "../../pages/chatRoom";
import HelpForm from "../ListItem";
import { MapApp } from "../Map/Map";
import { useProviderContext } from "../../App";
import { useContractContext } from "../../hooks/contract";

const { Sider, Content } = Layout;

const items = [
  {
    label: <Link to="/map">Map</Link>,
    key: "/map",
    icon: <CompassOutlined />,
  },
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
    key: "/chat",
    icon: <WechatOutlined />,
  },
  {
    label: <Link to="/sell">Sell</Link>,
    key: "/sell",
    icon: <PlusCircleOutlined />,
  },
];

const Main = () => {
  const { address } = useContractContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      navigate("/", { replace: true });
    }
  }, [navigate, address]);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/map", { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        minHeight: "100vh",
      }}
    >
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
            <Route path={"/map" || "/"} element={<MapApp />} />
            <Route path={"/products"} element={<Products />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/chat" element={<ChatRoom address={address} />} />
            <Route path="/sell" element={<HelpForm address={address} />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
};

export default Main;
