import React, { useState } from "react";
import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import Alert from "react-bootstrap/Alert";
import Toggle from "react-toggle";
import { Button } from "semantic-ui-react";
import {
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
import ActivityIndicator from "../ActivityIndicator";
import "react-toggle/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

const HelpForm = ({ dappContract = "", address = "", provider }) => {
  const [isInPerson, setIsInPerson] = useState(false);
  const [file, setFile] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const storage = new Web3Storage({
        token: process.env.REACT_APP_WEB3_STORAGE,
      });

      const helpObject = {
        title: title,
        description: description,
        address: address,
        isOnline: !isInPerson,
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

  const uploadPhoto = async (event) => {
    event.preventDefault();

    try {
      const storage = new Web3Storage({
        token: process.env.REACT_APP_WEB3_STORAGE,
      });

      const cid = await storage.put(file, {
        onRootCidReady: (localCid) => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
          console.log("> 📡 sending files to web3.storage ");
        },
        onStoredChunk: (bytes) =>
          console.log(
            `> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`
          ),
      });

      console.log(`https://${cid}.ipfs.dweb.link/${file[0].name}`);
    } catch (error) {
      console.warn("Error: ", error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <>
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

          <Form onSubmit={uploadPhoto}>
            <FormH1>List your item</FormH1>
            <FormLabel htmlFor="for">Name of the product</FormLabel>
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
            <FormLabel htmlFor="for">Price</FormLabel>
            <FormInput
              type="number"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
            <FormLabel htmlFor="for">Photo</FormLabel>
            <FormInput
              type="file"
              onChange={(event) => setFile(event.target.files)}
              required
            />
            <FormButton type="submit">Submit Request</FormButton>
          </Form>
        </FormContent>
      </FormWrap>
    </>
  );
};

export default HelpForm;
