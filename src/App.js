import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { BrowserRouter } from 'react-router-dom';
import {
  Mainnet,
  Kovan,
  Mumbai,
  DAppProvider,
} from '@usedapp/core';

import Main from './components/Main/Main';
import Home from "./pages";

import "./App.css";

export const contractAddress = "0x6ed0039582D833756A87B347A978ECC6652ff028"

const chainConfig = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    // [Mainnet.chainId]: 'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Kovan.chainId]: 'https://kovan.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Mumbai.chainId]: RPC NEEDED HERE
  }
}

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const App = () => {
  const [dappContract, setDappContract] = useState(null);
  const [chainId, setChainId] = useState(1);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();

  const web3Modal = new Web3Modal({
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

  const reset = () => {
    setAddress("");
    setProvider(undefined);
    web3Modal.clearCachedProvider();
  };

  const connect = async () => {
    const web3Provider = await web3Modal.connect();

    web3Provider.on("disconnect", reset);

    const accounts = await web3Provider.enable();
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);

    const provider = new providers.Web3Provider(web3Provider);
    setProvider(provider);
  };

  return (
    <DAppProvider config={chainConfig}>
      <Router>
        <Routes>
          {!address ? (
            <Route
              index
              element={
                <Home
                  dappContract={dappContract}
                  connect={connect}
                  address={address}
                />
              }
              exact
            />
          ) : (
            <Route path="/*" element={<Main />} exact />
          )}
        </Routes>
      </Router>
    </DAppProvider>
  );
};

export default App;
