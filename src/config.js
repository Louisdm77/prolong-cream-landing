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

  // Meta Pixel IDs. These are the ones already running on degreatstores.com.
  // Override with VITE_FB_PIXEL_IDS, or edit the list.
  pixelIds: envPixels.length
    ? envPixels
    : [
        '805890715505239',
        '2267743820653312',
        '906982882071587',
        '1386676502852055',
        '1106324765684022',
        '983958181374013',
        '2359349084882296',
      ],

  // Orders: set at least one of these (see .env.example).
  orderEndpoint: env.VITE_ORDER_ENDPOINT || '',
  whatsappNumber: (env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),

  // Real product photos. To host them in this project instead, put the files in
  // /public/images and change these to '/images/your-file.jpg'.
  // If a photo fails to load, the page shows the built-in illustration instead.
  photos: {
    hero: 'https://degreatstores.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-17-at-17.19.58-2.jpeg',
    usage: 'https://degreatstores.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-27-at-18.08.50.jpeg',
    pack: 'https://degreatstores.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-17-at-17.19.58-1.jpeg',
  },

  packages: [
    { id: 'one', tubes: 1, title: '1 Cream', tag: 'Starter pack', price: 18000 },
    { id: 'two', tubes: 2, title: '2 Creams', tag: 'Best value pack', price: 30000, popular: true },
    { id: 'four', tubes: 4, title: '3 Creams + 1 free', tag: 'Ultimate reserve', price: 49500 },
  ],
  defaultPackageId: 'two',

  // Customer feedback carried over from the current page.
  // Only publish reviews that real customers actually gave you.
  reviews: [
    {
      text: 'This cream helped me stay more in control during intimate moments. I was hard all through and I had a good time with my wife.',
      name: 'Mr. Oluwaseun',
      place: 'Lagos',
    },
    {
      text: 'Very straightforward to use. No strange sensations and it gave me the perfect erection I needed without having to take any pills.',
      name: 'Chukwudi',
      place: 'Abuja, FCT',
    },
    {
      text: 'My babe and I had the best time ever in the bedroom after I tried this cream. Delivery to my place was fast and smooth.',
      name: 'Emma',
      place: 'Jos',
    },
  ],
}

export const naira = (n) => '₦' + Number(n).toLocaleString('en-NG')

export const regularFor = (pkg) => pkg.tubes * config.regularPricePerTube
export const savingFor = (pkg) => regularFor(pkg) - pkg.price
export const percentOff = (pkg) => Math.round((savingFor(pkg) / regularFor(pkg)) * 100)
export const perTube = (pkg) => Math.round(pkg.price / pkg.tubes)
