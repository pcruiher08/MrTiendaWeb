import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Debug: surface when the client bundle executes
console.log('APP CLIENT BUNDLE START');

createRoot(document.getElementById("root")!).render(<App />);
