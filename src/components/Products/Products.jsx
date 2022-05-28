import { Button, Card, Col, message, Row } from 'antd';
import { utils } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { useContractContext } from '../../hooks/contract';
import ActivityIndicator from "../ActivityIndicator";

const ProductCard = ({ product, merchant }) => {
  const [maticPrice, setMaticPrice] = useState(null);
  const { dappContract, aggregatorContract } = useContractContext();

  const getMaticPrice = useCallback(async () => {
    const { answer } = await aggregatorContract?.latestRoundData();
    setMaticPrice(answer.toNumber() / 10 ** 8);
  }, [aggregatorContract]);

  useEffect(() => {
    getMaticPrice();
  }, []);

  const initiateBuy = async () => {
    const key = "initiateBuy";
    await message.loading({ content: "Waiting for acceptance...", key });
    try {
      const priceToSend = utils.parseUnits(
        `${(product.price * maticPrice) / 1000}`
      );
      const res = await dappContract?.makePurchaseRequest(
        merchant.id,
        product.id,
        { value: priceToSend }
      );
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
      style={{ width: 200 }}
      cover={
        <img
          alt={product.name}
          src={product.img ? product.img : "https://picsum.photos/300/300"}
          style={{ height: 200, width: 190 }}
        />
      }
      hoverable
      title={product.name}
      actions={[
        <div
          style={{ height: 40, paddingLeft: 10 }}
        >{`Price: ${product.price}${product.currency}`}</div>,
        <Button onClick={initiateBuy}>Buy</Button>,
      ]}
    >
      <div style={{ height: 40 }}>{product.description}</div>
    </Card>
  );
};

const Products = () => {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableMerchants, setAvailableMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = await fetch(
        "https://mapofcrypto-cdppi36oeq-uc.a.run.app/products"
      );
      const { products } = await p.json();
      setAvailableProducts(products);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  }, []);

  const getMerchants = useCallback(async () => {
    try {
      const m = await fetch(
        "https://mapofcrypto-cdppi36oeq-uc.a.run.app/merchants"
      );
      const { merchants } = await m.json();

      setAvailableMerchants(merchants);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getProducts();
    getMerchants();
  }, [getProducts, getMerchants]);

  const renderProducts = useCallback(() => {
    const getMerchant = (merchantId) =>
      availableMerchants.find((m) => m.id === merchantId);
    return availableProducts.map((product, index) => (
      <Col key={`${product.id}${index}`} span={6}>
        <ProductCard
          product={product}
          merchant={getMerchant(product.merchant)}
        />
      </Col>
    ));
  }, [availableProducts, availableMerchants]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return <Row gutter={[16, 16]}>{renderProducts()}</Row>;
};

export default Products;
