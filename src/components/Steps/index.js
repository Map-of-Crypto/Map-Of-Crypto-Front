import React from "react";
import { Step } from "semantic-ui-react";
import "./index.css";
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
} from "../InfoSection/InfoElements";

const StepExampleGroup = ({
  topLine,
  headline,
  description,
  img,
  alt,
  connect,
  address,
}) => {
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
        </Step.Group>
      </InfoWrapper>
    </InfoContainer>
  );
};

export default StepExampleGroup;
