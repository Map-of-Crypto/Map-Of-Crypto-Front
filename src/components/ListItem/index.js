import React, { useEffect, useState } from "react";
import { Web3Storage } from "web3.storage";
import Alert from "react-bootstrap/Alert";
import { uid } from "uid";
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
} from "./ListItemElements";
import { LocationPicker } from "../Map/LocationPicker";
import ActivityIndicator from "../ActivityIndicator";
import "react-toggle/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [latlng, setLatlng] = useState(null);
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      console.log(latlng);
      const storage = new Web3Storage({
        token: process.env.REACT_APP_WEB3_STORAGE,
      });

      const cid = await storage.put(file, {
        maxRetries: 3,
        onRootCidReady: (localCid) => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
          console.log("> 📡 sending files to web3.storage ");
        },
        onStoredChunk: (bytes) =>
          console.log(
            `> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`
          ),
      });

      const product = {
        currency: "USD",
        description: description,
        id: uid(16),
        merchant: address,
        name: title,
        price: price,
        shippingCosts: {
          DE: "5.00",
          HR: "12.00",
          MX: "20.00",
          PL: "10.00",
          US: "15.00",
        },
        store: "C and A",
        img: `https://${cid}.ipfs.dweb.link/${file[0].name}`,
        lattitude: latlng ? latlng.lat : 0,
        longitude: latlng ? latlng.lng : 0,
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      };
      fetch(
        "https://mapofcrypto-cdppi36oeq-uc.a.run.app/products",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => console.log(data));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.warn("Error: ", error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
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
              If you already have a running Advert you need to cancel it first.
              You can only have one Advert running at a time.
            </p>
          </Alert>
        </div>

        <Form onSubmit={handleSubmit}>
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
          <FormLabel htmlFor="for">
            Please select the location of the product
          </FormLabel>
          <div style={{ height: "100px", marginBottom: "10px" }}>
            <LocationPicker setPosition={setLatlng} />
          </div>
          <FormButton type="submit">Submit Request</FormButton>
        </Form>
      </FormContent>
    </FormWrap>
  );
};

export default HelpForm;
