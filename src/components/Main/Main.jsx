import { TagOutlined, WalletOutlined } from "@ant-design/icons";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { Layout, Menu } from 'antd';
import { providers } from 'ethers';
import Web3Modal from "web3modal";
import React, { useState, useCallback, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Home from '../../pages/';
import Products from '../Products/Products';
import Purchases from "../Purchases/Purchases";
const { Sider, Content } = Layout;


const items = [
  { label: <Link to="/products">Products</Link>, key: '/products', icon: <TagOutlined /> }, // remember to pass the key prop
  { label: <Link to="/purchases">Purchases</Link>, key: '/purchases', icon: <WalletOutlined /> }, // which is required
];

const Main = () => {
  const location = useLocation();
  const [dappContract, setDappContract] = useState(null);
  const [chainId, setChainId] = useState(1);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();

  const web3Modal = new Web3Modal({
    providers,
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    },
  });

  const connect = async () => {
    if (!process.env.REACT_APP_INFURA_ID) {
      throw new Error("Missing Infura Id");
    }
    const web3Provider = await web3Modal.connect();

    // useEffect(() => { web3Provider.on("disconnect", reset) }, []);

    const accounts = await web3Provider.enable();
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);

    const provider = new providers.Web3Provider(web3Provider);
    setProvider(provider);
  };


  const reset = () => {
    setAddress("");
    setProvider(undefined);
    web3Modal.clearCachedProvider();
  };
  // const web3Provider = useCallback(async () => await web3Modal.connect(), [web3Modal]);

  // web3Provider.on("disconnect", reset);

  // const accounts = useCallback(async () => await web3Provider.enable(), [web3Provider]);
  // setAddress(accounts[0]);
  // setChainId(web3Provider.chainId);

  // useEffect(() => { setProvider(new providers.Web3Provider(web3Provider)) }, []);

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
            <Route exact path="/" element={<Home
              dappContract={dappContract}
              connect={connect}
              address={address}
            />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
};

export default Main;