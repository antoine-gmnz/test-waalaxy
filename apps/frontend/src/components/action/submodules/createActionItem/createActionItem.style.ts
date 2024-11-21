import styled from 'styled-components';

export const CreateActionItemContainer = styled.div`
  height: 50px;
  width: 170px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 5px;

  background: ${(props) => props.theme.darkerBlue};
  color: ${(props) => props.theme.white};

  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${(props) => props.theme.lightBlue};
    color: ${(props) => props.theme.darkerBlue};

    cursor: pointer;

    width: 180px;
  }
`;
