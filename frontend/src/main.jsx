import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#252525',
          color: '#E5E3D4',
          border: '1px solid rgba(106, 102, 157, 0.2)',
        },
        success: {
          iconTheme: {
            primary: '#9ABF80',
            secondary: '#252525',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#252525',
          },
        },
      }}
    />
  </React.StrictMode>
);
