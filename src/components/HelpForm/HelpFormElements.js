import styled from 'styled-components';
import Select from 'react-select';

import { Link } from 'react-router-dom';

export const Container = styled.div`
  min-height: 692px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
  overflow: hidden;
  background-color: #151515;
`;

export const FormWrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 400px) {
    height: 80%;
  }
`;

export const Icon = styled(Link)`
  margin-left: 32px;
  margin-top: 32px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 32px;

  @media screen and (max-width: 480px) {
    margin-left: 16px;
    margin-top: 8px;
  }
`;

export const FormContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 480px) {
    padding: 10px;
  }
`;

export const Form = styled.form`
  background: #1d1e22;
  max-width: 400px;
  height: auto;
  width: 100%;
  z-index: 1;
  display: grid;
  margin: 0 auto;
  padding: 80px 32px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

  @media screen and (max-width: 400px) {
    padding: 32px 32px;
  }
`;

export const FormH1 = styled.h1`
  margin-bottom: 40px;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
`;

export const FormLabel = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: #fff;
`;
export const FormSelect = styled(Select)`
  margin-bottom: 32px;
  border: 2px solid #242529;
  border-radius: 4px;
  background: #171717;

  &:focus {
    transition: all 0.2s ease-in-out;
    outline: 1px solid #242529;
    border: none;
    background-color: #25262a;
  }
`;

export const FormInput = styled.input`
  padding: 16px 16px;
  margin-bottom: 32px;
  border: 2px solid #242529;
  color: white;
  border-radius: 4px;
  background-color: #171717;

  &:focus {
    transition: all 0.2s ease-in-out;
    outline: 1px solid #0dcaf4;
    border: none;
    background-color: #25262a;
  }
`;
export const FormArea = styled.textarea`
  padding: 16px 16px;
  margin-bottom: 32px;
  border: 2px solid #242529;
  color: white;
  border-radius: 4px;
  background-color: #171717;

  &:focus {
    outline: 1px solid #0dcaf4;
    border: none;
    background-color: #25262a;
  }
`;

export const FormButton = styled.button`
  background: #0dcaf4;
  padding: 14px 0;
  border: none;
  border-radius: 8px;
  color: #121212;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    transition: all 0.2s ease-in-out;
    background-color: #1faecf;
  }
`;
export const Text = styled.span`
  text-align: center;
  margin-top: 24px;
  color: #fff;
  font-size: 14px;
`;
