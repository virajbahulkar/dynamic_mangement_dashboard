import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
// Syncfusion component styles
import '@syncfusion/ej2/material.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import AppErrorBoundary from './components/AppErrorBoundary';

ReactDOM.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <ThemeProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);
