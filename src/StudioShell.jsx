import { useState } from 'react';
import CreatorBar from './CreatorBar.jsx';
import YcctEpicApp from './upgrade/YcctEpicApp.jsx';

export default function StudioShell() {
  const [mode, setMode] = useState('public');

  const openStudio = () => setMode('studio');

  return mode === 'studio' ? <YcctEpicApp /> : <CreatorBar onOpenStudio={openStudio} />;
}
