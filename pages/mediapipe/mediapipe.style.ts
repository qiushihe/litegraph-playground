import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  .square-box {
    width: 33%;
    height: 0;
    padding-top: 33%;
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .landmark-grid-container {
    height: 100%;
    width: 100%;
    position: absolute;
    top:0;
    left:0;
    background-color: #99999999;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .abs {
    position: absolute;
  }

  a {
    color: white;
    text-decoration: none;
    &:hover {
      color: lightblue;
    }
  }

  body {
    bottom: 0;
    font-family: 'Titillium Web', sans-serif;
    color: white;
    left: 0;
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: 0px 0px;
    overflow: hidden;
  }

  .container {
    position: absolute;
    background-color: #596e73;
    width: 100%;
    height: 100%;
  }

  .input_video {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    &.selfie {
      transform: scale(-1, 1);
    }
  }

  .input_image {
    position: absolute;
  }

  .canvas-container {
    display:flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items:center;
  }

  .output_canvas {
    width: 100%;
    display: block;
    position: relative;
    left: 0;
    top: 0;
  }

  .logo {
    bottom: 10px;
    right: 20px;

    .title {
      color: white;
      font-size: 28px;
    }

    .subtitle {
      position: relative;
      color: white;
      font-size: 10px;
      left: -30px;
      top: 20px;
    }
  }

  .control-panel {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  .loading {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    backface-visibility: hidden;
    justify-content: center;
    opacity: 1;
    transition: opacity 1s;

    .message {
      font-size: x-large;
    }

    .spinner {
      position: absolute;
      width: 120px;
      height: 120px;
      animation: spin 1s linear infinite;
      border: 32px solid #bebebe;
      border-top: 32px solid #3498db;
      border-radius: 50%;
    }
  }

  .loaded .loading {
    opacity: 0;
  }

  .shoutout {
    left: 0;
    right: 0;
    bottom: 40px;
    text-align: center;
    font-size: 24px;
    position: absolute;
  }
`;
