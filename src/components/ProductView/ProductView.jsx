import styled from 'styled-components';
import { Button, Col, Row, Image, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import useProductContext from "../../hooks/productContext";
import { useParams } from 'react-router-dom';
import ActivityIndicator from "../ActivityIndicator";
import { useTradeFunctions } from '../../hooks/useTradeFunctions';

const { Title, Text } = Typography;

const Box = styled.div`
    width: 100%;
    min-height: 100px;
    height: 100%;
    background-color: #fff;
    padding: 16px;
`
const ImageWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`
const ProductView = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { products, getSingleProduct } = useProductContext();
    const { initiateBuy, getMaticPrice } = useTradeFunctions();
    const params = useParams();
    useEffect(() => {
        let product = products.find(p => String(p.id) === String(params.productId));

        if (!product) {
            product = getSingleProduct(params.productId);
        }
        setSelectedProduct(product);
    }, [getSingleProduct, setSelectedProduct, products, params]
    )

    useEffect(() => { getMaticPrice() }, [getMaticPrice]);

    if (!selectedProduct) {
        return <ActivityIndicator />;
    }
    const handleBuy = (event) => {
        event.stopPropagation();
        initiateBuy(selectedProduct);
    }
    return <Row justify="left" gutter={[{ xs: 8, md: 16 }, { xs: 8, md: 16 }]} align="strech">
        <Col xs={24} md={12}>
            <Box>
                <ImageWrapper>
                    <Image
                        width={250}
                        src={selectedProduct.image}
                    />
                </ImageWrapper>
            </Box>
        </Col>
        <Col xs={24} md={12}>
            <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ flex: 3 }}><Title level={3}>{selectedProduct.title}</Title></div>
                <span style={{ flex: 4 }}><Text style={{ fontSize: 64 }} strong>{selectedProduct.price}</Text> <Text style={{ fontSize: 46 }}>USD</Text></span>
                <Button size='large' type="primary" block onClick={handleBuy}>
                    Buy
                </Button>
            </Box>
        </Col>
        <Col span={24}>
            <Box>
                <Text>{selectedProduct.description}</Text>
            </Box>
        </Col>
    </Row>
}

export default ProductView;