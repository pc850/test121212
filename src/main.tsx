
// Polyfills for WalletConnect
window.global = window;
window.Buffer = window.Buffer || require('buffer').Buffer;

// Create a type-safe process polyfill
interface ProcessEnv {
  [key: string]: string | undefined;
}

interface ProcessPolyfill {
  env: ProcessEnv;
}

// Apply the process polyfill with correct typing
window.process = window.process || { env: {} } as unknown as ProcessPolyfill;

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
