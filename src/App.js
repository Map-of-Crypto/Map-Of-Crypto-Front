import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";

import Home from "./pages";

import "./App.css";

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const App = () => {
  const [dappContract, setDappContract] = useState(null);
  const [memberNFT, setMemberNFT] = useState(null);
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
    if (!process.env.REACT_APP_INFURA_ID) {
      throw new Error("Missing Infura Id");
    }
    const web3Provider = await web3Modal.connect();

    web3Provider.on("disconnect", reset);

    const accounts = await web3Provider.enable();
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);

    const provider = new providers.Web3Provider(web3Provider);
    setProvider(provider);
  };

  return (
    <Router>
      <Routes>
        {!memberNFT ? (
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
          <Route path="/*" element={<Home />} exact />
        )}
      </Routes>
    </Router>
  );
};

export default App;
