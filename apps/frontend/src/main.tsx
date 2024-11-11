import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import styled, { ThemeProvider } from 'styled-components';
import { QueueTimer } from './components/queueTimer/queueTimer.component';
import { GlobalStyle, STYLED_THEME } from './styles/base';
import { Card } from './components/ui/card.component';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body
);

// @INFO: styled-components is installed, you can use it if you want ;)
const Container = styled.main`
  background: rgb(255,255,255);
  background: linear-gradient(215deg, rgba(255,255,255,1) 0%, rgba(119,141,169,1) 100%);

  margin: 0;
  height: 100vh;
  width: 100%;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  color: ${props => props.theme.white}
`;

root.render(
  <StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={STYLED_THEME}>
      <Container>
        <QueueTimer />
        <Card></Card>
        <Card></Card>
      </Container>
    </ThemeProvider>
  </StrictMode >
);
