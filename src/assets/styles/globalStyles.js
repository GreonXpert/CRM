// /src/assets/styles/globalStyles.js
import { css } from '@emotion/react';

const globalStyles = css`
  /* Custom Scrollbar for a cleaner look */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default globalStyles;
