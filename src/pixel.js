// Meta (Facebook) Pixel helper.
// Standard events fired by this site:
//   PageView          every page view (landing and /thank-you)
//   ViewContent       landing page loaded
//   AddToCart         a package is chosen
//   InitiateCheckout  the visitor starts filling the order form
//   Lead              the order form is submitted successfully
//   Purchase          the /thank-you page is shown after an order
import { config } from './config'

let ready = false
let firstView = true

// The base pixel code (Meta's own snippet, with the pixel ID and the first PageView)
// lives in index.html. This only switches on the event helper below.
export function initPixel() {
  ready = typeof window !== 'undefined' && typeof window.fbq === 'function'
}

const eventId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10)

export function track(name, params = {}) {
  if (!ready || !window.fbq) return
  // index.html already sent the PageView for the first screen.
  if (name === 'PageView' && firstView) {
    firstView = false
    return
  }
  window.fbq('track', name, params, { eventID: eventId() })
}

export const packageParams = (pkg) => ({
  content_name: config.productName,
  content_category: 'Men wellness',
  content_ids: [`prolong-cream-${pkg.id}`],
  content_type: 'product',
  num_items: pkg.tubes,
  value: pkg.price,
  currency: config.currency,
})
