import React, { useState } from 'react';
import { Step } from 'semantic-ui-react';
import './index.css';
import {
  Column1,
  Column2,
  Heading,
  Img,
  ImgWrap,
  InfoContainer,
  InfoRow,
  InfoWrapper,
  Subtitle,
  TextWrapper,
  TopLine,
} from '../InfoSection/InfoElements';
import { WorldIDComponent } from '../WorldIDComponent/WorldIDComponent';

const StepExampleGroup = ({
  topLine,
  headline,
  description,
  img,
  alt,
  connect,
  address,
  mintNFT,
}) => {
  const [worldIDProof, setWorldIDProof] = useState(null);

  return (
    <InfoContainer lightBg={true} id={"signup"}>
      <InfoWrapper>
        <InfoRow imgStart={true}>
          <Column1>
            <TextWrapper>
              <TopLine> {topLine} </TopLine>
              <Heading lightText={false}>{headline}</Heading>
              <Subtitle darkText={true}>{description}</Subtitle>
            </TextWrapper>
          </Column1>
          <Column2>
            <ImgWrap>
              <Img src={img} alt={alt} />
            </ImgWrap>
          </Column2>
        </InfoRow>

        <Step.Group style={{ marginBottom: "50px" }}>
          <Step disabled={!address ? false : true}>
            <div
              className="link active step "
              onClick={connect}
              style={{ height: "70%" }}
            >
              <div style={{ width: "60px", marginRight: "20px" }}>
                <Img
                  src={
                    address
                      ? require("../../images/checkMark.png")
                      : require("../../images/meta.png")
                  }
                  alt="Logo"
                />
              </div>
              <div style={{ flexDirection: "column" }}>
                <Step.Content>
                  <Step.Title>MetaMask</Step.Title>
                  <Step.Description>Connect to MetaMask</Step.Description>
                </Step.Content>
              </div>
            </div>
          </Step>

          <Step disabled={address && !worldIDProof ? false : true}>
            <div
              className="step"
              style={{ height: "90%", flexDirection: "column", flex: 1 }}
            >
              <div
                style={{
                  flexDirection: "row",
                }}
              >
                <Step.Group
                  style={{
                    border: 0,
                    marginBottom: "15px",
                    marginLeft: "-25px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      marginRight: "20px",
                    }}
                  >
                    <Img
                      src={require("../../images/worldcoin.png")}
                      alt="Logo"
                    />
                  </div>

                  <Step.Content>
                    <Step.Title>WorldCoin</Step.Title>
                    <Step.Description>
                      Verify yourself using WorldCoin
                    </Step.Description>
                  </Step.Content>
                </Step.Group>
              </div>
              {address && (
                <WorldIDComponent
                  signal={address}
                  setProof={(proof) => setWorldIDProof(proof)}
                />
              )}
            </div>
          </Step>

          <Step disabled={worldIDProof ? false : true}>
            <div className="link  step" style={{ height: "70%" }}>
              <div style={{ width: "60px", marginRight: "20px" }}>
                <Img src={require("../../images/icon.png")} alt="Logo" />
              </div>
              <div style={{ flexDirection: "column" }}>
                <Step.Content>
                  <Step.Title>NFT</Step.Title>
                  <Step.Description>Mint an NFT</Step.Description>
                  <button onClick={mintNFT}>Mint NFT</button>
                </Step.Content>
              </div>
            </div>
          </Step>
        </Step.Group>
      </InfoWrapper>
    </InfoContainer>
  );
};

export default StepExampleGroup;
