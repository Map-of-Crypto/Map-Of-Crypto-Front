import React from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { Img } from '../InfoSection/InfoElements';
import {
  FooterContainer,
  FooterWrap,
  SocialMedia,
  SocialMediaWrap,
  SocialLogo,
  WebsiteRights,
} from './FooterElements';
import Logo from "../../images/moc1.png";

const Footer = () => {
  const toggleHome = () => {
    scroll.scrollToTop();
  };
  return (
    <FooterContainer>
      <FooterWrap>
        <SocialMedia>
          <SocialMediaWrap>
            <SocialLogo to="/" onClick={toggleHome}>
              <div style={{ width: "120px", marginRight: "20px" }}>
                <Img src={Logo} alt="Logo" style={{ filter: "invert(1)" }} />
              </div>{" "}
            </SocialLogo>
            <WebsiteRights>
              Map<sup>of</sup> Crypto © 2022 All rights reserved.
            </WebsiteRights>
          </SocialMediaWrap>
        </SocialMedia>
      </FooterWrap>
    </FooterContainer>
  );
};

export default Footer;
