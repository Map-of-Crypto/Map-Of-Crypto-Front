import React, { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";
import { Framework as SuperfluidFramework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import "react-toggle/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";

import {
  Container,
  FormWrap,
  FormContent,
  Form,
  FormH1,
  FormLabel,
  FormInput,
  FormButton,
  FormSelect,
  FormArea,
} from "./HelpFormElements";

import Toggle from "react-toggle";
import ActivityIndicator from "../ActivityIndicator";
import { Button } from "semantic-ui-react";

const options = [
  { value: "study", label: "Study" },
  { value: "fixing", label: "Fixing" },
  { value: "social", label: "Social" },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#171717",

    "&:focus": {
      outline: "1px solid #0dcaf4",
      border: "none",
      backgroundColor: "#25262a",
    },
    "&:hover": {
      backgroundColor: "#171717",
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    marginTop: 0,

    backgroundColor: "#25262a",
    color: "white",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),

  menuItem: (base) => ({
    ...base,

    backgroundColor: "#25262a",
  }),
};

const HelpForm = ({ dappContract, address, provider }) => {
  const [isInPerson, setIsInPerson] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(options[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [show, setShow] = useState(false);
  const [superfluid, setSuperfluid] = useState(undefined);
  const [existingFlow, setExistingFlow] = useState(false);

  const daiTokenContract = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      // if (existingFlow) {
      //   throw new Error("You have the stream open");
      // }
      const storage = new Web3Storage({
        token: process.env.REACT_APP_WEB3_STORAGE,
      });

      // const signer = provider.getSigner(0);
      // const createFlowOperation = superfluid.cfaV1.createFlow({
      //   sender: address,
      //   receiver: process.env.REACT_APP_CONTRACT_ADDRESS,
      //   superToken: daiTokenContract,
      //   flowRate: 1000,
      // });
      // const txnResponse = await createFlowOperation.exec(signer);
      // const txnReceipt = await txnResponse.wait();

      const helpObject = {
        title: title,
        description: description,
        address: address,
        isOnline: !isInPerson,
        helpAdCategory: category.value,
      };

      const blob = new Blob([JSON.stringify(helpObject)], {
        type: "application/json",
      });
      const file = new File([blob], "helpPost.json");

      const cid = await storage.put([file], {
        onRootCidReady: (localCid) => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
          console.log("> 📡 sending files to web3.storage ");
        },
        onStoredChunk: (bytes) =>
          console.log(
            `> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`
          ),
      });

      const helpRequestLink = `${cid}.ipfs.dweb.link/helpPost.json`;

      const addRequest = await dappContract.addHelpAd(helpRequestLink);
      await addRequest.wait();
      setIsLoading(false);
      setIsValid(true);
      setShow(true);
    } catch (error) {
      console.warn("Error: ", error);

      setIsLoading(false);
      setIsValid(false);
      setShow(true);
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

  // useEffect(() => {
  //   if (!superfluid) return;
  //   setIsLoading(true);
  //   const fetchStream = async () => {
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
  // }, [address, provider, superfluid]);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <Container>
      <FormWrap>
        <FormContent>
          <div
            style={{
              width: "300px",
              alignSelf: "center",
              position: "absolute",
              zIndex: 10000,
              left: "auto",
              top: "auto",
            }}
          >
            <Alert
              show={show && isValid}
              onClose={() => setShow(false)}
              variant="success"
              dismissible
            >
              <Alert.Heading>Success!</Alert.Heading>
              <p>Your help request has been published successfully!</p>
              <p>It might take a few minutes to appear on your dashboard.</p>
              <hr />
              <p className="mb-0">
                You have opened a continuous cashflow that will be sending money
                as long as your Advert is being shown, you can delete the Advert
                and cancel the subscription at any point.
              </p>
            </Alert>

            <Alert
              show={show && !isValid}
              onClose={() => setShow(false)}
              variant="danger"
              dismissible
            >
              <Alert.Heading>Oh Snap!</Alert.Heading>
              <p>It seems like something went wrong :/</p>
              <hr />
              <p className="mb-0">
                If you already have a running Advert you need to cancel it
                first. You can only have one Advert running at a time.
              </p>
            </Alert>
          </div>

          <Form onSubmit={handleSubmit}>
            <FormH1>Create a Help Request</FormH1>
            <FormLabel htmlFor="for">Category</FormLabel>
            <FormSelect
              defaultValue={options[0]}
              value={category}
              onChange={(category) => setCategory(category)}
              options={options}
              required
              styles={customStyles}
            />
            <FormLabel htmlFor="for">Title</FormLabel>
            <FormInput
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <FormLabel htmlFor="for">Description</FormLabel>
            <FormArea
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />

            <FormLabel htmlFor="for">
              Should This Help be Performed in Person?
            </FormLabel>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
              <Toggle
                id="isInPerson"
                defaultChecked={isInPerson}
                onChange={() => setIsInPerson((prev) => !prev)}
              />
            </div>
            <FormButton type="submit">Submit Request</FormButton>
          </Form>
        </FormContent>
      </FormWrap>
    </Container>
  );
};;

export default HelpForm;
