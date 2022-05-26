import { TagOutlined, WalletOutlined } from "@ant-design/icons";
import { Layout, Menu } from 'antd';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Products from '../Products/Products';
import Purchases from "../Purchases/Purchases";
import { useProviderContext } from "../../App";
const { Sider, Content } = Layout;


const items = [
  { label: <Link to="/products">Products</Link>, key: '/products', icon: <TagOutlined /> }, // remember to pass the key prop
  { label: <Link to="/purchases">Purchases</Link>, key: '/purchases', icon: <WalletOutlined /> }, // which is required
];

const Main = () => {
  const location = useLocation();
  const { provider, address } = useProviderContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      console.log("Should renavigate to app");
      navigate("/", { replace: true })
    }
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', minHeight: "100vh" }}>
      <Layout>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
            selectedKeys={location.pathname}
            selectable
          />
        </Sider>
        <Content
          style={{
            padding: '24px',
            minHeight: 280,
          }}>
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/purchases" element={<Purchases />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
};

export default Main;