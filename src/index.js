import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import StoreProvider from './Store/StoreProvider';
import App from './App';

ReactDOM.render(
    <BrowserRouter>
        <StoreProvider>
            <App />
        </StoreProvider>
    </BrowserRouter>
    , document.getElementById('root')
);
