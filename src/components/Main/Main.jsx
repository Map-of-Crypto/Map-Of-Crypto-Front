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
import React, { useEffect, useMemo } from "react";
import Products from "../Products/Products";
import Purchases from "../Purchases/Purchases";
import { ChatRoom } from "../../pages/chatRoom";
import ListForm from "../ListItem";
import { MapApp } from "../Map/Map";
import { useContractContext } from "../../hooks/contract";
import useProductContext from "../../hooks/productContext";
import ProductView from "../ProductView/ProductView";

const { Sider, Content } = Layout;

const items = [
  {
    label: (
      <Link style={{ textDecoration: "none" }} to="/map">
        Map
      </Link>
    ),
    key: "/map",
    icon: <CompassOutlined />,
  },
  {
    label: (
      <Link style={{ textDecoration: "none" }} to="/purchases">
        Deals
      </Link>
    ),
    key: "/purchases",
    icon: <WalletOutlined />,
  },
  {
    label: (
      <Link style={{ textDecoration: "none" }} to="/chat">
        Chat Room
      </Link>
    ),
    key: "/chat",
    icon: <WechatOutlined />,
  },
  {
    label: (
      <Link style={{ textDecoration: "none" }} to="/sell">
        Sell
      </Link>
    ),
    key: "/sell",
    icon: <PlusCircleOutlined />,
  },
];

const Main = () => {
  const { address } = useContractContext();
  const { getCategories, categories } = useProductContext();
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

  useEffect(() => {
    if (!categories.length) {
      getCategories();
    }
  }, [getCategories, categories.length]);

  const menuItems = useMemo(() => {
    const newItems = [...items];

    newItems.unshift({
      label: (
        <Link style={{ textDecoration: "none" }} to="/products">
          Products
        </Link>
      ),
      key: "/products",
      icon: <TagOutlined />,
      children: categories.map((category) => ({
        label: (
          <Link style={{ textDecoration: "none" }} to={`/products/${category}`}>
            {category}
          </Link>
        ),
        key: `products-category-${category}`,
      })),
    });
    return newItems;
  }, [categories]);

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
            items={menuItems}
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
            <Route path={"/products/:category"} element={<Products />} />
            <Route
              path={"/products/product/:productId"}
              element={<ProductView />}
            />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/chat" element={<ChatRoom address={address} />} />
            <Route path="/sell" element={<ListForm address={address} />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
};

export default Main;
