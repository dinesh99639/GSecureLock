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

    .noOverflow {
        overflow:hidden; 
        white-space:nowrap; 
        text-overflow: ellipsis;
    }
    
    :root {
        --timebar-color: ${({ theme }) => theme.timebar.color};
    }

    .main-header {
        background-color: ${({ theme }) => theme.header.backgroundColor};
        box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 10px 0px !important;
    }

    .timebar {
        color: ${({ theme }) => theme.timebar.color};
        background-color: ${({ theme }) => theme.timebar.backgroundColor};
        padding: 10px 0;
        text-align: center;
    }
    
    .lockScreen {
        color: ${({ theme }) => theme.lockScreen.color};
        background-color: ${({ theme }) => theme.lockScreen.backgroundColor};
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

    /* width */
    ::-webkit-scrollbar {
        width: 7px;
    }   
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 25px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
`;