import { useState } from 'react';
import App from './App.jsx';
import CreatorBar from './CreatorBar.jsx';

export default function StudioShell() {
  const [mode, setMode] = useState('public');

  const openStudio = () => {
    setMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (mode === 'studio') {
    return <App />;
  }

  return <CreatorBar onOpenStudio={openStudio} />;
}
