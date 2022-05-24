import { Button, Card, Col, message, Row } from 'antd';
import React, { useCallback } from 'react';

import merchantMock from './mockedMerchants.json';
import productMock from './mockedProducts.json';


const ProductCard = ({ product, merchant }) => {
  // const ethersContext = useEthersContext();
  // const mapOfCrypto = useAppContracts('MapOfCrypto', ethersContext.chainId);

  const initiateBuy = async () => {
    const key = 'updatable';
    await message.loading({ content: 'Waiting for acceptance...', key });
    try {
      // const res = await mapOfCrypto?.makePurchaseRequest(merchant.id, product.id);
      await message.success({
        content: (
          <span>
            Success:{' '}
            <a
              target="_blank"
              title="Transaction hash"
              href={`https://kovan.etherscan.io/tx/${'yada%20yada'}`}
              rel="noreferrer">
              Check transaction on etherscan
            </a>
          </span>
        ),
        duration: 5,
        key,
      });
    } catch (err) {
      console.error(err);
      await message.error({ content: err.message, duration: 3, key });
    }
  };

  return (
    <Card
      cover={<img alt="example" src="https://picsum.photos/300/300" />}
      hoverable
      title={product.name}
      actions={[<div>{`Price: ${product.price}${product.currency}`}</div>, <Button onClick={initiateBuy}>Buy</Button>]}>
      <div>{product.description}</div>
    </Card>
  );
};

const Products = () => {
  const { products } = productMock;

  const renderProducts = useCallback(() => {
    const { merchants } = merchantMock;
    const getMerchant = (merchantId) => merchants.find((m) => m.id === merchantId);
    return products.map((product) => (
      <Col key={`${product.id}`} span={6}>
        <ProductCard product={product} merchant={getMerchant(product.merchant)} />
      </Col>
    ));
  }, [products]);

  return <Row gutter={[16, 16]}>{renderProducts()}</Row>
};

export default Products;
