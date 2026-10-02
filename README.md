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
3. **Photos.** The page loads your product photos from degreatstores.com. To host them here,
   put the files in `public/images/` and update `photos` in `src/config.js`.

Prices, packages, reviews and photos are all in `src/config.js`.

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
