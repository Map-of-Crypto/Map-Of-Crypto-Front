import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";
import {
  sectionOne,
  sectionTwo,
  sectionThree,
  sectionFour,
  sectionFive,
} from "../components/InfoSection/Data";
import Services from "../components/Services";
import StepExampleGroup from "../components/Steps";

const Home = ({ connect, address }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} connect={connect} address={address} />
      <HeroSection />
      <InfoSection {...sectionOne} />
      <InfoSection {...sectionTwo} />
      <InfoSection {...sectionThree} />
      <InfoSection {...sectionFour} />
      <Services />
      <StepExampleGroup {...sectionFive} connect={connect} address={address} />
      <Footer />
    </>
  );
};

export default Home;
