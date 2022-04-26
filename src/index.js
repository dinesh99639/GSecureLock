import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { GApiProvider } from './api/GApiProvider';
import StoreProvider from './Store/StoreProvider';
import App from './App';

ReactDOM.render(
    <BrowserRouter>
        <StoreProvider>
            <GApiProvider>
                <App />
            </GApiProvider>
        </StoreProvider>
    </BrowserRouter>
    , document.getElementById('root')
);
