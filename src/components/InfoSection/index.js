import React from 'react';
import { Button } from '../ButtonElements';
import Lottie from 'react-lottie';

import {
  InfoContainer,
  InfoWrapper,
  InfoRow,
  Column1,
  Column2,
  TextWrapper,
  TopLine,
  Heading,
  Subtitle,
  BtnWrap,
  ImgWrap,
  Img,
} from './InfoElements';
import Step from '../Steps';

const InfoSection = ({
  lightBg,
  imgStart,
  topLine,
  lightText,
  headline,
  description,
  buttonLabel,
  img,
  alt,
  id,
  primary,
  darkText,
  dark,
  dark2,
  lottie = false,
  noButton = false,
  small = false,
  steps = false,
  svg,
  connect,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <>
      <InfoContainer lightBg={lightBg} id={id}>
        <InfoWrapper small={small}>
          <InfoRow imgStart={imgStart}>
            <Column1>
              <TextWrapper>
                <TopLine> {topLine} </TopLine>
                <Heading lightText={lightText}>{headline}</Heading>
                <Subtitle darkText={darkText}>{description}</Subtitle>
                {!noButton && (
                  <BtnWrap>
                    <Button
                      to='signup'
                      smooth={true}
                      duration={500}
                      spy={true}
                      exact='true'
                      offset={-80}
                      primary={primary ? 1 : 0}
                      dark={dark ? 1 : 0}
                      dark2={dark2 ? 1 : 0}
                    >
                      {buttonLabel}
                    </Button>
                  </BtnWrap>
                )}
              </TextWrapper>
            </Column1>
            <Column2>
              <ImgWrap>
                {lottie ? (
                  <Lottie options={defaultOptions} />
                ) : svg ? (
                  <Img src={img} alt={alt} />
                ) : (
                  <Img src={img} alt={alt} />
                )}
              </ImgWrap>
            </Column2>
          </InfoRow>

          {steps && <Step connect={connect} />}
        </InfoWrapper>
      </InfoContainer>
    </>
  );
};

export default InfoSection;
