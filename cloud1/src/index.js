import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Check if we're on a page that should render React components
const reactRoot = document.getElementById('react-root');

if (reactRoot) {
  const root = ReactDOM.createRoot(reactRoot);
  root.render(<App />);
}

// Export components for use in other pages
window.React = React;
window.ReactDOM = ReactDOM;