import { useEffect, useMemo, useRef, useState } from 'react'
import { config, naira, regularFor, savingFor, perTube } from './config'
import { track, packageParams } from './pixel'
import { Photo, TubeArt, ParcelArt, ApplyArt } from './Illustrations'

const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

const ORDER_KEY = 'prolong:lastOrder'
const store = {
  save(order) { try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)) } catch { /* private mode */ } },
  peek() {
    try {
      const raw = sessionStorage.getItem(ORDER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  },
  clear() { try { sessionStorage.removeItem(ORDER_KEY) } catch { /* private mode */ } },
}

const isThanks = () => window.location.pathname.replace(/\/$/, '') === '/thank-you'

export default function App() {
  const [thanks, setThanks] = useState(isThanks)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const onPop = () => setThanks(isThanks())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    track('PageView')
    window.scrollTo(0, 0)
  }, [thanks])

  const complete = (placed) => {
    store.save(placed)
    setOrder(placed)
    window.history.pushState({}, '', '/thank-you')
    setThanks(true)
  }

  return thanks ? <ThankYou order={order} /> : <Landing onComplete={complete} />
}

/* ------------------------------ Landing page ------------------------------ */

function Landing({ onComplete }) {
  const [pkgId, setPkgId] = useState(config.defaultPackageId)
  const pkg = useMemo(() => config.packages.find((p) => p.id === pkgId), [pkgId])
  const starter = config.packages[0]
  const hasFeedback = config.feedbackScreenshots.length > 0 || config.feedbackMessages.length > 0

  useEffect(() => {
    track('ViewContent', {
      content_name: config.productName,
      content_type: 'product',
      value: starter.price,
      currency: config.currency,
    })
  }, [starter.price])

  const choose = (id) => {
    setPkgId(id)
    track('AddToCart', packageParams(config.packages.find((p) => p.id === id)))
  }

  const toOrder = (e) => {
    e.preventDefault()
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <p className="topbar">For adult men only (18+)</p>

      <main className="letter">
        <p className="pre">A plain message for grown men. Read it to the end.</p>

        <h1>
          The small herbal cream men use for <mark>more staying power and more confidence</mark>
        </h1>

        <p className="center big">No drugs to swallow. No injection. It is a cream that is rubbed on, that's all.</p>

        <Photo eager className="shot" src={config.photos.hero} alt={`${config.productName} tube`} fallback={<TubeArt count={1} />} />

        <a href="#order" className="btn" onClick={toOrder}>👉 Yes, I want my own cream</a>
        <p className="center small">NAFDAC approved. Delivered to your door in a covered package.</p>

        <h2>Brother, let's be honest</h2>
        <p>
          Stamina is something most men think about and very few men talk about. Stress, long workdays
          and plain tiredness all play their part.
        </p>
        <p>This is what men tell us they want:</p>
        <ul className="list want">
          <li>More staying power in intimate moments.</li>
          <li>More confidence at the end of a long, stressful day.</li>
          <li>An option that is not another heavy pill to swallow.</li>
          <li>Something private that nobody else needs to know about.</li>
        </ul>
        <p>
          That is exactly what this cream was made for.
        </p>

        <h2>This is where {config.productName} comes in</h2>
        <p>
          {config.productName} is a NAFDAC approved herbal cream for men, made to <strong>support stamina
          and control</strong> during intimacy. It is not swallowed. It is rubbed on the skin beforehand.
        </p>
        <ul className="list yes">
          <li><strong>Staying power.</strong> Made to support endurance and control of the pace.</li>
          <li><strong>Firmness.</strong> Made to support firmness from start to finish.</li>
          <li><strong>Peace of mind.</strong> Preparing ahead means one less thing to think about.</li>
          <li><strong>Works where it is applied.</strong> No capsules, no waiting for the stomach to digest anything.</li>
          <li><strong>It is mild on the skin.</strong> Made for a grown man's intimate skin.</li>
        </ul>

        <Photo className="shot" src={config.photos.pack} alt={`${config.productName} pack`} fallback={<TubeArt count={2} />} />

        <h2>How to use it (3 simple steps)</h2>
        <ol className="steps">
          <li><strong>Wash.</strong> Wash the private area with warm water and dry it.</li>
          <li><strong>Rub.</strong> Rub the cream over the whole private area.</li>
          <li><strong>Massage.</strong> Massage for about 5 minutes so it absorbs well.</li>
        </ol>
        <p className="warn">For external use only. For adults only.</p>

        <Photo className="shot" src={config.photos.usage} alt={`How to apply ${config.productName}`} fallback={<ApplyArt />} />

        <h2>Nobody will know what you ordered</h2>
        <div className="parcel"><ParcelArt /></div>
        <ul className="list yes">
          <li>The package is fully covered. Nothing is written on the outside.</li>
          <li>Our dispatch manager calls only you.</li>
          <li>Your name and number go nowhere else.</li>
        </ul>

        {hasFeedback && (
          <>
            <h2>See what our customers send us</h2>
            <div className="chats">
              {config.feedbackScreenshots.map((src) => (
                <img key={src} className="chat-shot" src={src} alt="Customer feedback screenshot" loading="lazy" />
              ))}
              {config.feedbackMessages.map((m) => (
                <div key={m.text} className="bubble">
                  <p>{m.text}</p>
                  <span>{m.name}{m.place ? `, ${m.place}` : ''}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 id="order">Now pick the one you want 👇</h2>
        <p className="center">
          The normal price is <s>{naira(regularFor(starter))}</s> for one. Today you get it for{' '}
          <strong className="red">{naira(starter.price)}</strong>. Buy more and each one gets cheaper.
        </p>

        <div className="packs" role="radiogroup" aria-label="Package">
          {config.packages.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={p.id === pkgId}
              className={`pack ${p.id === pkgId ? 'is-on' : ''}`}
              onClick={() => choose(p.id)}
            >
              <span className="dot" aria-hidden="true" />
              <span className="pack-main">
                <span className="pack-title">
                  {p.title} {p.popular && <em>Most men pick this one</em>}
                </span>
                <span className="pack-save">
                  You save {naira(savingFor(p))}
                  {p.tubes > 1 && ` (${naira(perTube(p))} each)`}
                </span>
              </span>
              <span className="pack-money">
                <s>{naira(regularFor(p))}</s>
                <b>{naira(p.price)}</b>
              </span>
            </button>
          ))}
        </div>

        <OrderForm pkg={pkg} onComplete={onComplete} />

        <h2>Questions men ask us</h2>
        <div className="qa">
          <p className="q">Is it only for older men?</p>
          <p>No. It is for adult men of any age.</p>
          <p className="q">Is it hard to use?</p>
          <p>Not at all. Wash and dry the area, rub the cream on well, and massage until it absorbs.</p>
          <p className="q">Is it safe for my skin?</p>
          <p>It is a herbal cream for external use and it is made to be mild. Still, test a little on a small area first. If it itches or burns, stop using it.</p>
          <p className="q">What is it made to do?</p>
          <p>It is made to support stamina, control and firmness during intimacy. Results differ from man to man.</p>
          <p className="q">Will anyone know what I ordered?</p>
          <p>No. The package is covered and we call only you.</p>
        </div>

        <p className="ps">
          <strong>P.S.</strong> You can close this page and nothing changes. Or you can fill the form, get your cream,
          and try something different this week. The choice is yours.
        </p>
        <p className="ps">
          <strong>P.P.S.</strong> If you pick 2 for {naira(config.packages[1].price)}, each cream comes down to{' '}
          {naira(perTube(config.packages[1]))} instead of {naira(config.regularPricePerTube)}.
        </p>

        <a href="#order" className="btn" onClick={toOrder}>👉 Take me to the order form</a>
      </main>

      <footer className="footer">
        <p>
          This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is
          not endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
        </p>
        <p>Results differ from person to person. This product is not intended to diagnose, treat or cure any disease.</p>
        <p>&copy; {new Date().getFullYear()} {config.productName} Nigeria. All rights reserved.</p>
      </footer>

      <div className="sticky">
        <div>
          <span className="sticky-label">{pkg.title}</span>
          <span className="sticky-price">{naira(pkg.price)}</span>
        </div>
        <a href="#order" className="btn" onClick={toOrder}>Order now</a>
      </div>
    </>
  )
}

/* ------------------------------- Order form ------------------------------- */

function OrderForm({ pkg, onComplete }) {
  const [form, setForm] = useState({ name: '', phone: '', phone2: '', address: '', state: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const started = useRef(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const begin = () => {
    if (started.current) return
    started.current = true
    track('InitiateCheckout', packageParams(pkg))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Enter a phone number with at least 10 digits so we can call you.')
      return
    }
    if (!config.orderEndpoint && !config.whatsappNumber) {
      setError('The order form is not connected yet. Set VITE_ORDER_ENDPOINT or VITE_WHATSAPP_NUMBER (see README).')
      return
    }

    const placed = {
      package: `${pkg.title} (${naira(pkg.price)})`,
      packageId: pkg.id,
      tubes: pkg.tubes,
      amount: pkg.price,
      currency: config.currency,
      ...form,
      page: window.location.href,
      placedAt: new Date().toISOString(),
    }

    setStatus('sending')
    try {
      if (config.orderEndpoint) {
        const res = await fetch(config.orderEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(placed),
        })
        if (!res.ok) throw new Error(`Order endpoint answered ${res.status}`)
      }
      track('Lead', packageParams(pkg))
      if (config.whatsappNumber) {
        const text = [
          `New order: ${config.productName}`,
          `Package: ${placed.package}`,
          `Name: ${form.name}`,
          `Phone: ${form.phone}`,
          form.phone2 && `Other phone: ${form.phone2}`,
          `Address: ${form.address}`,
          `State: ${form.state}`,
        ].filter(Boolean).join('\n')
        window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      }
      onComplete(placed)
    } catch (err) {
      console.error(err)
      setStatus('idle')
      setError('Your order did not go through. Check your network and tap the button again.')
    }
  }

  return (
    <form className="order" onSubmit={submit} onFocus={begin}>
      <div className="order-head">
        <h3>Fill this form and we will bring it to you</h3>
        <p>Our dispatch manager will call you to confirm before we deliver.</p>
      </div>

      <label>
        Full name
        <input type="text" required autoComplete="name" value={form.name} onChange={set('name')} />
      </label>
      <label>
        Phone number
        <input type="tel" required inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} />
      </label>
      <label>
        Other phone number <span className="opt">(optional)</span>
        <input type="tel" inputMode="tel" value={form.phone2} onChange={set('phone2')} />
      </label>
      <label className="full">
        Delivery address
        <input type="text" required autoComplete="street-address" value={form.address} onChange={set('address')} />
      </label>
      <label className="full">
        State
        <select required value={form.state} onChange={set('state')}>
          <option value="" disabled>Select your state</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>

      <div className="summary full">
        <span>{pkg.title}</span>
        <span>
          <s>{naira(regularFor(pkg))}</s> <strong>{naira(pkg.price)}</strong>
        </span>
      </div>

      {error && <p className="error full" role="alert">{error}</p>}

      <button className="btn btn-big full" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending your order…' : `Send my order: ${naira(pkg.price)}`}
      </button>
      <p className="fine full">Your details are used only to deliver your order.</p>
    </form>
  )
}

/* -------------------------------- Thank you ------------------------------- */

function ThankYou({ order: passed }) {
  const [order] = useState(() => passed || store.peek())
  const fired = useRef(false)

  useEffect(() => {
    // Purchase fires once per real order, never on a plain visit or refresh.
    if (!order || fired.current) return
    fired.current = true
    store.clear()
    track('Purchase', {
      content_name: config.productName,
      content_ids: [`prolong-cream-${order.packageId}`],
      content_type: 'product',
      num_items: order.tubes,
      value: order.amount,
      currency: order.currency,
    })
  }, [order])

  return (
    <main className="thanks">
      <div className="letter">
        <div className="thanks-art"><TubeArt count={order ? order.tubes : 1} /></div>
        <h1>{order ? `Order placed. Thank you, ${order.name.split(' ')[0]}.` : 'Thank you.'}</h1>
        {order ? (
          <>
            <p className="lede">
              We have your order for <strong>{order.package}</strong>. Keep your phone close: our
              dispatch manager will call <strong>{order.phone}</strong> to confirm delivery.
            </p>
            <p className="fine">Your cream arrives in plain, discreet packaging.</p>
          </>
        ) : (
          <p className="lede">If you just placed an order, our dispatch manager will call you to confirm delivery.</p>
        )}
        <a className="btn" href="/">Back to the product page</a>
      </div>
    </main>
  )
}
