import './styles/tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWithProvider from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppWithProvider />
  </React.StrictMode>
);
