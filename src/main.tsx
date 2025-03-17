
// Polyfills for WalletConnect
window.global = window;
window.Buffer = window.Buffer || require('buffer').Buffer;
window.process = window.process || { env: {} };

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
