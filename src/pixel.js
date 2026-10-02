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

export function initPixel() {
  if (ready || typeof window === 'undefined' || !config.pixelIds.length) return
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = true
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */
  config.pixelIds.forEach((id) => window.fbq('init', id))
  ready = true
}

const eventId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10)

export function track(name, params = {}) {
  if (!ready || !window.fbq) return
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
