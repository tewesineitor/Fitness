import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWithProvider from './App';

console.log(">>> index.tsx: IMPORTS AND APP MODULE LOADED");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error(">>> index.tsx: ROOT ELEMENT NOT FOUND!");
  throw new Error("Could not find root element to mount to");
}

console.log(">>> index.tsx: ROOT ELEMENT FOUND, CREATING ROOT");

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppWithProvider />
    </React.StrictMode>
  );
  console.log(">>> index.tsx: RENDER CALLED SUCCESSFULLY");
} catch (error) {
  console.error(">>> index.tsx: CRITICAL ERROR DURING MOUNT:", error);
}