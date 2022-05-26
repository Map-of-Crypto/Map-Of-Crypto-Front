import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Mainnet, Kovan, Mumbai, DAppProvider } from '@usedapp/core'
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { providers } from 'ethers';
import Web3Modal from "web3modal";
import Home from './pages'
import Main from './components/Main/Main';

import "./App.css";


const chainConfig = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    // [Mainnet.chainId]: 'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Kovan.chainId]: 'https://kovan.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    [Mumbai.chainId]: 'https://polygon-mumbai.g.alchemy.com/v2/UcJQZqq6LT_gfzyMrFZh0PD0GWni4R6a'
  }
}

export const ProviderContext = React.createContext({ provider: null})
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

  return <DAppProvider config={chainConfig}>
    <Router>
      <Routes>
        <Route
          path={'/'}
          exact
          element={
            <Home
              dappContract={dappContract}
              connect={connect}
              address={address}
            />
          }
        />
        <Route path="/*" element={<Main />}/>
      </Routes>
    </Router>
  </DAppProvider>
};

export default App;
