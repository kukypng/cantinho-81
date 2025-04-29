
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use createRoot API for concurrent mode rendering
const root = createRoot(document.getElementById("root")!);

// Render with better performance characteristics
root.render(<App />);
