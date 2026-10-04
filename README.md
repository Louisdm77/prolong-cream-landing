# Men's Prolong Cream landing page

React (Vite) sales page with Meta Pixel events built in.

## Run it

```bash
npm install
npm run dev      # local preview
npm run build    # production files in /dist
```

## Before you run ads

1. **Connect the order form.** Copy `.env.example` to `.env` and set `VITE_ORDER_ENDPOINT`
   (Formspree, a Google Sheets Apps Script URL, Make, Zapier or your own API) and/or
   `VITE_WHATSAPP_NUMBER`. Until one is set, the form shows an error instead of taking orders.
2. **Check the pixel IDs.** `src/config.js` uses the seven pixel IDs from degreatstores.com.
   Set `VITE_FB_PIXEL_IDS` (comma separated) to use different ones.
3. **Photos.** The product photos are in `public/images/`. Replace the files to change them.

Prices, packages, photos and customer feedback are all in `src/config.js`. The feedback section stays hidden until you add real customer screenshots or messages there.

## Pixel events

| Event | When it fires |
| --- | --- |
| `PageView` | Landing page and `/thank-you` |
| `ViewContent` | Landing page loads |
| `AddToCart` | Visitor picks a package |
| `InitiateCheckout` | Visitor starts filling the order form |
| `Lead` | Order form submitted successfully |
| `Purchase` | `/thank-you` shown after an order (value and currency NGN included) |

`Purchase` fires once per order, not on refresh. You can also build a custom conversion in
Ads Manager on the URL containing `/thank-you`.

## Deploy

Works on Vercel or Netlify as is (build command `npm run build`, output `dist`).
`vercel.json` and `public/_redirects` make `/thank-you` load correctly.
Add the same environment variables in your hosting dashboard.
