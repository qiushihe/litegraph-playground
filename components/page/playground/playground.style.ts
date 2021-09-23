import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  body {
    font-family: 'Helvetica Neue', sans-serif;
  }

  code {
    font-family: 'Courier New', monospace;
  }

  * {
    box-sizing: border-box;
  }
`;
