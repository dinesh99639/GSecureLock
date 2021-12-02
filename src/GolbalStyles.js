import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    *,
    *::after,
    *::before {
        box-sizing: border-box;
    }

    body {
        background-color: ${({ theme }) => theme.backgroundColor};
        color: ${({ theme }) => theme.color};
        transition: all 0.3s ease-in-out;
    }
    
    :root {
        --headerBackgroundColor: ${({ theme }) => theme.header.backgroundColor};
        --timebar-color: ${({ theme }) => theme.timebar.color};
    }

    .timebar {
        color: ${({ theme }) => theme.timebar.color};
        background-color: ${({ theme }) => theme.timebar.backgroundColor};
        padding: 10px 0;
        text-align: center;
    }
    
    .unlock {
        color: ${({ theme }) => theme.unlock.color};
        background-color: ${({ theme }) => theme.unlock.backgroundColor};
    }

    .borderRight {
        border-right: ${({ theme }) => theme.border};
    }

    .borderBottom {
        border-bottom: ${({ theme }) => theme.border};
    }

    .searchBox {
        background-color: ${({ theme }) => theme.searchBox.backgroundColor};
        border-left: ${({ theme }) => theme.searchBox.borderLeft};
        border-right: ${({ theme }) => theme.searchBox.borderRight};
    }
`;