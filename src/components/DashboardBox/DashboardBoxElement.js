import styled from 'styled-components';

export const Form = styled.div`
  background: #1d1e22;
  height: 150px;
  width: 500px;
  z-index: 1;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  padding: 20px;
`;

export const FormH1 = styled.h1`
  color: #fff;
  font-size: 80px;
  font-weight: 800;
`;

export const FormH2 = styled.h1`
  color: #fff;
  font-size: 30px;
  font-weight: 800;
`;
export const FormLabel = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: #fff;
`;
