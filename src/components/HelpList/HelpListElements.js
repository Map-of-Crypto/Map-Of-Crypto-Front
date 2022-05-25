import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column;
  width: 100%;
  height: 100%;
  background-color: #151515;
`;

export const HelpRequestContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 75%;
  height: 160px;
  border: 2px solid white;
  border-radius: 10px;
  color: #ffffff;
  margin-bottom: 20px;
  margin-left: 5%;
  align-items: center;
  cursor: pointer;

  &:hover {
    transition: all 0.2s ease-in-out;
    background-color: #333738};
  }
`;

export const HelpContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 5px;
  border-right: 2px solid white;
`;

export const HelpH1 = styled.h1`
  color: #fff;
  font-size: 1.35em;
  font-weight: 400;
  text-align: left;
  margin-left: 20px;
`;

export const HelpH2 = styled.h1`
  color: #a0a0a0;
  font-size: 1em;
  font-weight: 300;
  text-align: left;
  margin-top: 5px;
  margin-left: 20px;
`;

export const HelpImg = styled.img`
  width: 60px;
  margin-top: 0;
  margin-right: 20px;
  margin-left: 20px;
`;

export const OnSiteCircle = styled.img`
  width: 15px;
  height: 15px;
  background-color: ${({ active }) => (active ? '#0dcaf4' : '#eee')};
  border-radius: 8px;
  overflow: hidden;
  margin: 10px;
`;
