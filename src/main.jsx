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
    'position:fixed;left:8px;right:8px;top:8px;z-index:9999;padding:12px 14px;font:bold 14px/1.45 Arial,sans-serif;color:#fff;background:#555;border:3px solid #000;white-space:pre-line;word-break:break-all;max-height:90vh;overflow:auto'
  box.textContent = 'Pixel check: testing, wait 10 seconds...'
  document.body.appendChild(box)

  // A direct ping to Facebook's event address, independent of the tracker script.
  let ping = 'no answer'
  const img = new Image()
  img.onload = () => { ping = 'REACHED Facebook' }
  img.onerror = () => { ping = 'BLOCKED before reaching Facebook' }
  img.src = 'https://www.facebook.com/tr?id=1073564882134939&ev=PixelTestPing&noscript=1&t=' + Date.now()

  setTimeout(() => {
    const urls = performance.getEntriesByType('resource').map((r) => r.name)
    const fb = urls.filter((u) => /facebook\.(com|net)/.test(u))
    const lib = Boolean(window.fbq && window.fbq.callMethod)
    const conf = fb.some((u) => u.includes('/signals/config'))
    const sent = fb.filter((u) => u.includes('facebook.com/tr') && !u.includes('PixelTestPing')).length
    let ids = 'unknown'
    let counted = 'unknown'
    try {
      const st = window.fbq.getState()
      ids = st.pixels.map((p) => p.id).join(', ')
      counted = st.pixels.map((p) => p.eventCount).join(', ')
    } catch { /* tracker not loaded */ }
    const ok = lib && sent > 0
    box.style.background = ok ? '#0a7a2f' : '#c40000'
    box.textContent =
      (ok ? 'Pixel check: WORKING' : 'Pixel check: PROBLEM') +
      '\n1. Facebook tracker loaded: ' + (lib ? 'YES, version ' + window.fbq.version : 'NO') +
      '\n2. Pixel settings loaded: ' + (conf ? 'YES' : 'NO') +
      '\n3. Events sent to Facebook: ' + sent +
      '\n4. Events the tracker says it fired: ' + counted +
      '\n5. Pixel ID: ' + ids +
      '\n6. Direct ping: ' + ping +
      '\n7. Facebook addresses contacted:\n' + (fb.map((u) => '- ' + u.slice(8, 78)).join('\n') || '- none')
  }, 10000)
}
