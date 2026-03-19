import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWithProvider from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Suppress Recharts defaultProps warning in React 18 and width/height warnings
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args: any[]) => {
  const msg = args[0];
  if (typeof msg === 'string') {
    // Suppress defaultProps warning for Recharts components
    if (msg.includes('defaultProps') && (
      msg.includes('XAxis') || 
      msg.includes('YAxis') || 
      (args.length > 1 && (String(args[1]).includes('XAxis') || String(args[1]).includes('YAxis')))
    )) {
      return;
    }
  }
  originalError(...args);
};

console.warn = (...args: any[]) => {
  const msg = args[0];
  if (typeof msg === 'string') {
    // Suppress chart width/height warning
    if (msg.includes('width(0) and height(0) of chart should be greater than 0')) {
      return;
    }
  }
  originalWarn(...args);
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppWithProvider />
  </React.StrictMode>
);