import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    *,
    *::after,
    *::before {
        box-sizing: border-box;
    }

    :root {
        --headerBackgroundColor: ${({ theme }) => theme.header.backgroundColor};
    }

    body {
        background-color: ${({ theme }) => theme.backgroundColor};
        color: ${({ theme }) => theme.color};
        transition: all 0.3s ease-in-out;
    }
`;