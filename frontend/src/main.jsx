// ============================================
// main.jsx
// Application entry point
// Imports global styles and mounts React app
// ============================================

import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';

// StrictMode removed: it double-invokes effects in development which can
// trigger duplicate Supabase auth calls and exhaust email rate limits.
createRoot(document.getElementById('root')).render(
  <App />
);
