import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { GApiProvider } from './api/GApiProvider';
import StoreProvider from './Store/StoreProvider';
import App from './App';

ReactDOM.render(
    <BrowserRouter>
        <GApiProvider>
            <StoreProvider>
                <App />
            </StoreProvider>
        </GApiProvider>
    </BrowserRouter>
    , document.getElementById('root')
);
