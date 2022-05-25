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

const Footer = () => {
  const toggleHome = () => {
    scroll.scrollToTop();
  };
  return (
    <FooterContainer>
      <FooterWrap>
        <SocialMedia>
          <SocialMediaWrap>
            <SocialLogo to='/' onClick={toggleHome}>
              <div style={{ width: '120px', marginRight: '20px' }}>
                <Img
                  src={require('../../images/logo-text-white.png')}
                  alt='Logo'
                />
              </div>{' '}
            </SocialLogo>
            <WebsiteRights>
              Wolon<sup> 3.0</sup> © 2022 All rights reserved.
            </WebsiteRights>
          </SocialMediaWrap>
        </SocialMedia>
      </FooterWrap>
    </FooterContainer>
  );
};

export default Footer;
