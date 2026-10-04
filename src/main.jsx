import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initPixel } from './pixel'
import './styles.css'

// Load the pixel before anything renders so no event is dropped.
initPixel()

createRoot(document.getElementById('root')).render(<App />)

// Pixel self-check: open the site with ?pixeltest at the end of the address.
// It reports what this browser actually sent to Facebook. Customers never see it.
if (new URLSearchParams(window.location.search).has('pixeltest')) {
  const box = document.createElement('div')
  box.style.cssText =
    'position:fixed;left:8px;right:8px;top:8px;z-index:9999;padding:14px 16px;font:bold 15px/1.45 Arial,sans-serif;color:#fff;background:#555;border:3px solid #000;white-space:pre-line'
  box.textContent = 'Pixel check: testing, wait 8 seconds...'
  document.body.appendChild(box)
  setTimeout(() => {
    const urls = performance.getEntriesByType('resource').map((r) => r.name)
    const lib = Boolean(window.fbq && window.fbq.callMethod)
    const conf = urls.some((u) => u.includes('connect.facebook.net/signals/config'))
    const sent = urls.filter((u) => u.includes('facebook.com/tr')).length
    let ids = ''
    try { ids = window.fbq.getState().pixels.map((p) => p.id).join(', ') } catch { ids = 'unknown' }
    const ok = lib && sent > 0
    box.style.background = ok ? '#0a7a2f' : '#c40000'
    box.textContent =
      (ok ? 'Pixel check: WORKING' : 'Pixel check: PROBLEM') +
      '\n1. Facebook tracker loaded: ' + (lib ? 'YES' : 'NO (blocked by this browser, an ad blocker or the network)') +
      '\n2. Pixel settings loaded: ' + (conf ? 'YES' : 'NO') +
      '\n3. Events sent to Facebook: ' + sent +
      '\n4. Pixel ID: ' + ids
  }, 8000)
}
