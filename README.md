# Men's Prolong Cream landing page

React (Vite) sales page with Meta Pixel events built in.

## Run it

```bash
npm install
npm run dev      # local preview
npm run build    # production files in /dist
```

## Before you run ads

1. **Activate order emails.** Orders are emailed to the address in `src/config.js` (`orderEmail`)
   through FormSubmit. Place one test order, then click the activation link FormSubmit emails you.
   After that every order arrives in the inbox. To use another address set `VITE_ORDER_EMAIL`.
2. **Pixel.** The site reports to the pixel ID in `pixelIds` in `src/config.js`.
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
| `Contact` | Visitor taps the phone number |
| `Lead` | Order form submitted successfully |
| `Purchase` | `/thank-you` shown after an order (value and currency NGN included) |

`Purchase` fires once per order, not on refresh. You can also build a custom conversion in
Ads Manager on the URL containing `/thank-you`.

## Deploy

Works on Vercel or Netlify as is (build command `npm run build`, output `dist`).
`vercel.json` and `public/_redirects` make `/thank-you` load correctly.
Add the same environment variables in your hosting dashboard.
