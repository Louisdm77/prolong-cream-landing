import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initPixel } from './pixel'
import './styles.css'

// Load the pixel before anything renders so no event is dropped.
initPixel()

createRoot(document.getElementById('root')).render(<App />)

// Pixel self-check: open the site with ?pixeltest at the end of the address to see
// whether Facebook's tracker loaded in this browser. Customers never see this.
if (new URLSearchParams(window.location.search).has('pixeltest')) {
  const box = document.createElement('div')
  box.style.cssText =
    'position:fixed;left:8px;right:8px;top:8px;z-index:9999;padding:14px 16px;font:bold 16px/1.4 Arial,sans-serif;color:#fff;background:#555;border:3px solid #000'
  box.textContent = 'Pixel check: waiting...'
  document.body.appendChild(box)
  let tries = 0
  const timer = setInterval(() => {
    tries += 1
    const loaded = Boolean(window.fbq && window.fbq.callMethod)
    if (loaded) {
      box.style.background = '#0a7a2f'
      box.textContent = 'Pixel check: WORKING. Facebook tracker loaded in this browser. Pixel ' + (window.fbq.getState ? window.fbq.getState().pixels.map((p) => p.id).join(', ') : '')
      clearInterval(timer)
    } else if (tries >= 16) {
      box.style.background = '#c40000'
      box.textContent = window.fbq
        ? 'Pixel check: BLOCKED. This browser or network stopped Facebook\'s tracker from loading. Try Chrome with no ad blocker, or mobile data instead of Wi-Fi.'
        : 'Pixel check: NOT INSTALLED on this page.'
      clearInterval(timer)
    }
  }, 500)
}
