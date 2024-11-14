import styled, { createGlobalStyle } from "styled-components";

export const STYLED_THEME = {
  main: '#415a77',
  lightBlue: '#778da9',
  white: '#e0e1dd',
  darkBlue: '#1b263b',
  darkerBlue: '#0d1b2a'
}

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }

  * {
    font-family: 'Geist';
  }
`

export const HorizontalListContainer = styled.div`
  display: flex;
  gap: 5px;
`

export const FlexCenterCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const FlexCenterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`


