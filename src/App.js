import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { BrowserRouter } from "react-router-dom";
import { Mainnet, Kovan, Mumbai, DAppProvider, useEthers } from "@usedapp/core";

import { utils, Contract, providers } from "ethers";
import { useContractFunction } from "@usedapp/core";
import MapOfCryptoAbi from "./contracts/abi/MapOfCrypto.json";

import Main from "./components/Main/Main";
import Home from "./pages";

import "./App.css";

export const contractAddress = "0x6ed0039582D833756A87B347A978ECC6652ff028";



const ProviderContext = React.createContext({ address: null, provider: null });

export const useProviderContext = () => useContext(ProviderContext);

const chainConfig = {
  networks: [Mumbai],
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    // [Mainnet.chainId]: 'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Kovan.chainId]: 'https://kovan.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    [Mumbai.chainId]: 'https://polygon-mumbai.g.alchemy.com/v2/UcJQZqq6LT_gfzyMrFZh0PD0GWni4R6a'
  },
};

const providerOptions = {
  injected: {
    display: {
      name: 'Metamask',
      description: 'Connect with the provider in your Browser',
    },
    package: null,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      bridge: 'https://bridge.walletconnect.org',
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
}

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const App = () => {
  const [dappContract, setDappContract] = useState(null);
  const [chainId, setChainId] = useState(1);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();
  const { activate } = useEthers();

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions
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
    const mocContractInterface = new utils.Interface(MapOfCryptoAbi);
    console.log(provider.getSigner())
    const contract = new Contract(contractAddress, mocContractInterface, provider.getSigner());
    setProvider(provider);
    setDappContract(contract)
  };

  return (
    <DAppProvider config={chainConfig}>
      <ProviderContext.Provider value={{ provider, address, dappContract }}>
        <Router>
          <Routes>
            <Route
              exact
              index
              element={
                <Home
                  dappContract={dappContract}
                  connect={connect}
                />
              }
            />
            <Route exact path="/*" element={<Main />} />
          </Routes>
        </Router>
      </ProviderContext.Provider>
    </DAppProvider>
  );
};

export default App;
