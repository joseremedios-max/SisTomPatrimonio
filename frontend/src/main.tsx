import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MapProvider } from './context/MapContext';
import { registerServiceWorker } from './utils/pwaRegistration';
import App from './App';
import './index.css';

if (import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MapProvider><App /></MapProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
