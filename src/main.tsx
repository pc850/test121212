
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add Buffer polyfill for TON libraries
import { Buffer } from 'buffer';
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);
