import styled from 'styled-components';

export const CardContainer = styled.div`
  background: ${(props) => props.theme.white};
  padding: 20px;
  height: auto;
  min-width: 35%;
  color: ${(props) => props.theme.darkerBlue};
  border-radius: 10px;
`;
