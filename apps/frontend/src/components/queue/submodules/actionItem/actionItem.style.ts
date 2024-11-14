import styled from 'styled-components';

export const ActionContainer = styled.div`
  height: 50px;
  width: 50px;

  border: 1px solid ${(props) => props.theme.darkerBlue};
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const ActionItemText = styled.p`
  margin: 0;
`;
