import { Button, Card, Col, message, Row } from "antd";
import { utils } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContractContext } from "../../hooks/contract";
import useProductContext from "../../hooks/productContext";
import ActivityIndicator from "../ActivityIndicator";

// this is temporary haardcoded merchant address
const merchantWalletAddress = "0xED0262718A77e09C3C8F48696791747E878a5551";

const ProductCard = ({ product }) => {
  const [maticPrice, setMaticPrice] = useState(null);
  const { dappContract, aggregatorContract } = useContractContext();
  const navigate = useNavigate();
  const params = useParams();
  const getMaticPrice = useCallback(async () => {
    const { answer } = await aggregatorContract?.latestRoundData();
    setMaticPrice(answer.toNumber() / 10 ** 8);
  }, [aggregatorContract]);

  useEffect(() => {
    getMaticPrice();
  }, [getMaticPrice]);

  const initiateBuy = async (event) => {
    event.stopPropagation();
    const key = "initiateBuy";
    await message.loading({ content: "Waiting for acceptance...", key });
    try {
      const priceToSend = utils.parseUnits(
        `${(product.price * maticPrice) / 1000}`
      );
      const res = await dappContract?.makePurchaseRequest(product.id, {
        value: priceToSend,
      });
      await message.success({
        content: (
          <span>
            Success:{" "}
            <a
              target="_blank"
              title="Transaction hash"
              href={`https://mumbai.polygonscan.com//tx/${res.hash}`}
              rel="noreferrer"
            >
              Check transaction on Polygonscan
            </a>
          </span>
        ),
        duration: 5,
        key,
      });
    } catch (err) {
      console.error(err);
      await message.error({ content: message, duration: 3, key });
    }
  };

  return (
    <Card
      onClick={(event) => {
        navigate(`/products/product/${product.id}`);
      }}
      style={{ minWidth: 200, maxWidth: 400 }}
      cover={
        <img
          alt={product.name}
          src={product.image ? product.image : "https://picsum.photos/300/300"}
          style={{ maxHeight: 200, maxWidth: 400, objectFit: 'contain' }}
        />
      }
      hoverable
      title={product.name}
      actions={[
        <div
          style={{ height: 40, paddingLeft: 10 }}
        >{`Price: ${product.price}USD`}</div>,
        <Button onClick={initiateBuy}>Buy</Button>,
      ]}
    >
      <Card.Meta title={product.title} />
    </Card>
  );
};

const Products = () => {
  const [availableMerchants, setAvailableMerchants] = useState([]);
  const { isLoading, getProducts, products } = useProductContext();
  const params = useParams();
  const getMerchants = useCallback(async () => {
    try {
      const m = await fetch("https://fakestoreapi.com/users");
      const fetchedMerchants = await m.json();
      const merchants = fetchedMerchants.map((m) => ({
        ...m,
        walletAddress: merchantWalletAddress,
      }));
      setAvailableMerchants(merchants);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getProducts(params.category);
  }, [getProducts, params.category])

  useEffect(() => {
    getMerchants();
    if (!products.length) {
      getProducts(params.category);
    }
  }, [getProducts, getMerchants, products, params.category]);

  const renderProducts = useCallback(() => {
    const getMerchant = (merchantId) =>
      availableMerchants.find((m) => m.id === merchantId);
    return products.map((product, index) => (
      <Col key={`${product.id}${index}`} xs={24} sm={12} md={8} xl={6} span={6}>
        <ProductCard
          product={product}
          merchant={getMerchant(product.merchant)}
        />
      </Col>
    ));
  }, [products, availableMerchants]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <Row wrap gutter={[16, 16]}>
      {renderProducts()}
    </Row>
  );
};

export default Products;
