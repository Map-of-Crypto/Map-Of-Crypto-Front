// hooks/index.ts
import { utils, Contract } from "ethers";
import React, { useContext } from 'react';
import { useContractFunction } from "@usedapp/core";
import MapOfCryptoAbi from "../contracts/abi/MapOfCrypto.json";
import { contractAddress } from "../constants";

const mocContractInterface = new utils.Interface(MapOfCryptoAbi);
export const ContractContext = React.createContext({ address: null, provider: null, dappContract: null });

export const useContractContext = () => useContext(ContractContext);

export function usePurchaseList() {
  const { provider } = useContractContext();
  console.log(provider.getSigner())
  const signer = provider.getSigner()
  const contract = new Contract(contractAddress, mocContractInterface, signer)
  const { send, state } = useContractFunction({
    contract: contract,
    method: "getPurchaseList",
    // args: [],
  });

  return { send, state };
}