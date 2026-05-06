import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

// US-001.01: set schema version key as the first localStorage write
if (!localStorage.getItem('taskboard:version')) {
  localStorage.setItem('taskboard:version', '1');
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
