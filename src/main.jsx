import React from 'react';
import { createRoot } from 'react-dom/client';
import StudioShell from './StudioShell.jsx';
import './styles.css';
import './creator.css';
import './upgrade/epic.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StudioShell />
  </React.StrictMode>
);
