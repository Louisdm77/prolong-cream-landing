// Everything you are likely to edit lives in this file:
// prices, packages, photos, reviews, pixel IDs and where orders go.

const env = import.meta.env

const envPixels = (env.VITE_FB_PIXEL_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const config = {
  productName: "Men's Prolong Cream",
  currency: 'NGN',
  regularPricePerTube: 30000,

  // Phone number shown on the page for customers who prefer to call.
  phone: '08135390524',

  // Meta Pixel ID ("Prolong Website Pixel"). Override with VITE_FB_PIXEL_IDS if needed.
  pixelIds: envPixels.length ? envPixels : ['1073564882134939'],

  // Orders are emailed to this address through FormSubmit (formsubmit.co).
  // The very first order triggers a one-time activation email: click the link in it.
  orderEmail: env.VITE_ORDER_EMAIL || 'akwajidan1@gmail.com',
  // Optional: send orders to your own URL instead of email (any endpoint that accepts a JSON POST).
  orderEndpoint: env.VITE_ORDER_ENDPOINT || '',

  // Product photos, stored in /public/images. Replace the files or change the paths.
  photos: {
    hero: '/images/product.jpg',
    pack: '/images/box.jpg',
    usage: '/images/tube.jpg',
  },

  packages: [
    { id: 'one', tubes: 1, title: '1 Cream', tag: 'Starter pack', price: 18000 },
    { id: 'two', tubes: 2, title: '2 Creams', tag: 'Best value pack', price: 30000, popular: true },
    { id: 'four', tubes: 4, title: '3 Creams + 1 free', tag: 'Ultimate reserve', price: 49500 },
  ],
  defaultPackageId: 'two',

  // Customer feedback. Leave both lists empty and the section stays hidden.
  // Only add feedback that real customers actually sent you.
  //
  // 1) Screenshots of real WhatsApp chats (best for this style): put the image files in
  //    /public/images and list them here, e.g. ['/images/chat-1.jpg', '/images/chat-2.jpg']
  feedbackScreenshots: [],
  // 2) Typed-out messages, shown as chat bubbles, e.g.
  //    { text: 'the customer message', name: 'Customer', place: 'Ibadan' }
  feedbackMessages: [],
}

export const phonePretty = config.phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
export const phoneHref = 'tel:+234' + config.phone.replace(/^0/, '')

export const naira = (n) => '₦' + Number(n).toLocaleString('en-NG')

export const regularFor = (pkg) => pkg.tubes * config.regularPricePerTube
export const savingFor = (pkg) => regularFor(pkg) - pkg.price
export const percentOff = (pkg) => Math.round((savingFor(pkg) / regularFor(pkg)) * 100)
export const perTube = (pkg) => Math.round(pkg.price / pkg.tubes)
