import { useState } from 'react';
import App from './App.jsx';
import CreatorBar from './CreatorBar.jsx';

export default function StudioShell() {
  const [mode, setMode] = useState('public');

  if (mode === 'studio') {
    return <App />;
  }

  return <CreatorBar onOpenStudio={() => setMode('studio')} />;
}
