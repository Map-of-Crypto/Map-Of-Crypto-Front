import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Framework as SuperfluidFramework } from "@superfluid-finance/sdk-core";
import { Container } from "../components/SignIn/SigninElements";
import {
  HelpRequestContainer,
  HelpContent,
  HelpH2,
  HelpH1,
  HelpImg,
  OnSiteCircle,
} from "../components/HelpList/HelpListElements";
import ActivityIndicator from "../components/ActivityIndicator";
import DashboardBox from "../components/DashboardBox";
import {
  FaCoins,
  FaHandsHelping,
  FaHeart,
  FaMoneyBill,
  FaSchool,
  FaCar,
} from "react-icons/fa";

const Dashboard = ({ dappContract, memberNFT, provider, address }) => {
  const [budgetBalance, setBudgetBalance] = useState(null);
  const [helpAd, setHelpAd] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helperAddress, setHelperAddress] = useState("");
  const [superfluid, setSuperfluid] = useState(undefined);
  const [existingFlow, setExistingFlow] = useState(false);

  const daiTokenContract = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";

  const postHelpAd = async (link) => {
    try {
      const helpAd = await dappContract.addHelpAd(link);
    } catch (error) {
      console.warn("Error: ", error);
    }
  };

  const getBudgetBalance = async () => {
    try {
      const balance = await dappContract.getBudgetBalance();
      if (balance) {
        setBudgetBalance(ethers.utils.formatEther(balance));
      }
    } catch (error) {
      console.warn("Error: ", error);
    }
  };

  const getUserAd = async () => {
    try {
      const userAd = await dappContract.getUserAd();
      if (userAd) {
        fetch(`https://${userAd}`)
          .then((res) => res.json())
          .then((data) => {
            setHelpAd(data);
          });
      }
    } catch (error) {
      console.warn("Error: ", error);
    }
  };

  const removeAd = async () => {
    try {
      setIsLoading(true);

      // if (existingFlow !== false) {
      //   const daix = await superfluid.loadSuperToken("fDAIx");
      //   const signer = provider.getSigner(0);
      //   const deleteFlowOperation = superfluid.cfaV1.deleteFlow({
      //     sender: address,
      //     receiver: process.env.REACT_APP_CONTRACT_ADDRESS,
      //     superToken: daix.address,
      //   });
      //   console.log("Deleting your stream...");

      //   const transaction = await deleteFlowOperation.exec(signer);
      //   await transaction.wait();
      //   console.log(
      //     `Congrats - you've just deleted your money stream!
      //        Super Token: DAIxF
      //        Sender: ${address}
      //        Receiver: ${process.env.REACT_APP_CONTRACT_ADDRESS}
      //     `
      //   );
      // }

      const removeAd = await dappContract.removeUserAd();
      await removeAd.wait();
      setIsLoading(false);
    } catch (error) {
      console.warn("Error: ", error);
      setIsLoading(false);
    }
  };

  const helpFound = async () => {
    try {
      setIsLoading(true);
      const solved = await dappContract.helpFound(helperAddress);
      await solved.wait();
      setIsLoading(false);
    } catch (error) {
      console.warn("Error: ", error);
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!provider) {
  //     setSuperfluid(undefined);
  //     return;
  //   }
  //   SuperfluidFramework.create({
  //     chainId: 80001,
  //     provider,
  //   }).then(setSuperfluid);
  // }, [provider]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      await getUserAd();
      await getBudgetBalance();
      setIsLoading(false);
    };
    fetchUserData();
  }, [dappContract]);

  // useEffect(() => {
  //   if (!superfluid) return;
  //   setIsLoading(true);
  //   const fetchStream = async () => {
  //     const daix = await superfluid.loadSuperToken("fDAIx");
  //     const signer = provider.getSigner(0);
  //     try {
  //       const flow = await superfluid.cfaV1.getFlow({
  //         sender: address,
  //         receiver: process.env.REACT_APP_CONTRACT_ADDRESS,
  //         superToken: daiTokenContract,
  //         providerOrSigner: signer,
  //       });
  //       if (Number(flow.flowRate) > 0) {
  //         console.log(flow);
  //         setExistingFlow(flow);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       setExistingFlow(null);
  //       setIsLoading(false);
  //     }
  //   };

  //   setTimeout(() => {
  //     fetchStream();
  //     setIsLoading(false);
  //   }, 3000);
  // }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <Container>
      <div style={{ color: "white", marginLeft: "20%", marginTop: "10%" }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <DashboardBox
            amount={memberNFT.helperTokens}
            icon={<FaCoins />}
            label="Tokens"
            unit="WLN Tokens"
          />
          <DashboardBox
            amount={memberNFT.budgetBalance}
            icon={<FaMoneyBill />}
            label="Total Collected Budget"
            unit="Matic"
          />
          <DashboardBox
            amount={memberNFT.foundHelp}
            icon={<FaHeart />}
            label="Help Received"
            unit="Help"
          />

          <DashboardBox
            amount={0}
            icon={<FaHandsHelping />}
            label="Total Supported"
            unit="Matic"
          />
        </div>
        {!helpAd ? (
          <div></div>
        ) : (
          <HelpRequestContainer>
            <div style={{ fontSize: "80px", padding: "10px" }}>
              {helpAd.helpAdCategory === "study" ? <FaSchool /> : <FaCar />}
            </div>
            <HelpContent>
              <HelpH1>{helpAd.title}</HelpH1>
              <HelpH2>{helpAd.description}</HelpH2>
              <HelpH2>{helpAd.address}</HelpH2>
            </HelpContent>
            <HelpH1>On-Site:</HelpH1>
            <OnSiteCircle active={!helpAd.isOnline} />
            <button onClick={removeAd}>Remove Ad</button>
            <input
              type="text"
              value={helperAddress}
              onChange={(event) => setHelperAddress(event.target.value)}
            />
            <button onClick={helpFound}>Help Found</button>
          </HelpRequestContainer>
        )}
      </div>
    </Container>
  );
};;

export default Dashboard;
