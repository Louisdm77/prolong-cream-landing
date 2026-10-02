import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initPixel } from './pixel'
import './styles.css'

// Load the pixel before anything renders so no event is dropped.
initPixel()

createRoot(document.getElementById('root')).render(<App />)
