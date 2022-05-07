import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { GApiProvider } from './api/GApiProvider';
import StoreProvider from './Store/StoreProvider';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <StoreProvider>
            <GApiProvider>
                <App />
            </GApiProvider>
        </StoreProvider>
    </BrowserRouter>
);
