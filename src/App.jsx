import { useEffect, useMemo, useRef, useState } from 'react'
import { config, naira, regularFor, savingFor, percentOff, perTube } from './config'
import { track, packageParams } from './pixel'
import { Photo, TubeArt, ParcelArt, ApplyArt, Check } from './Illustrations'

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
      <p className="topbar">NAFDAC approved. Discreet packaging. Private delivery.</p>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="pill">For men who want to last longer</p>
            <h1>Last longer tonight. Finish when you decide.</h1>
            <p className="lede">
              {config.productName} is a herbal cream you rub on before intimacy. It is made to delay
              climax, so you set the pace, stay firm and keep going until you are both satisfied.
            </p>
            <ul className="ticks">
              <li><Check /> No pills to swallow. You apply it on the skin.</li>
              <li><Check /> Made to be gentle on intimate skin.</li>
              <li><Check /> Arrives in plain packaging. Nobody knows what is inside.</li>
            </ul>

            <div className="pricebox">
              <div>
                <span className="was">{naira(regularFor(starter))}</span>
                <span className="now">{naira(starter.price)}</span>
              </div>
              <span className="save">Save {percentOff(starter)}% today</span>
            </div>

            <a href="#order" className="btn btn-big" onClick={toOrder}>Order now from {naira(starter.price)}</a>
            <p className="fine">Fill a 30 second form. Our dispatch manager calls you to confirm delivery.</p>
          </div>

          <div className="hero-art">
            <Photo eager src={config.photos.hero} alt={`${config.productName} tube`} fallback={<TubeArt count={1} />} />
          </div>
        </div>
      </header>

      <section className="band band-dark">
        <div className="wrap split">
          <div>
            <h2>It is not about desire. It is about control.</h2>
            <p className="sub">
              Stress, long workdays and worry get in the way for plenty of men. If any of these sound
              like you, you are not alone, and you do not have to keep quiet about it.
            </p>
          </div>
          <ul className="worries">
            <li>You finish before you and your woman are ready.</li>
            <li>After a long, stressful day you worry about getting and keeping an erection.</li>
            <li>You want better control without swallowing harsh, heavy pills.</li>
            <li>You want something private that you can use without any drama.</li>
          </ul>
        </div>
      </section>

      <section className="band" id="product">
        <div className="wrap">
          <h2>Meet {config.productName}</h2>
          <p className="sub">One small tube, made for three things men ask for most.</p>
          <div className="trio">
            <article>
              <h3>Go longer</h3>
              <p>Made to delay climax and support your endurance, so the pace stays in your hands.</p>
            </article>
            <article>
              <h3>Stay firm</h3>
              <p>Made to support your erection and help you keep it firm from start to finish.</p>
            </article>
            <article>
              <h3>Walk in confident</h3>
              <p>When you are not worried about how long you will last, you can focus on her.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="band band-tint">
        <div className="wrap split split-art">
          <div className="art-frame">
            <Photo src={config.photos.pack} alt={`${config.productName} pack`} fallback={<TubeArt count={2} />} />
          </div>
          <div>
            <h2>Why men choose the cream over pills</h2>
            <dl className="benefits">
              <div>
                <dt>You stay in charge of your timing</dt>
                <dd>Made to help you pace yourself and stay relaxed instead of rushing.</dd>
              </div>
              <div>
                <dt>Less worry before you start</dt>
                <dd>Preparing ahead takes the pressure off, so you feel composed before intimacy begins.</dd>
              </div>
              <div>
                <dt>Works where you apply it</dt>
                <dd>Rub it straight on the gbola. No capsules, no waiting on your stomach.</dd>
              </div>
              <div>
                <dt>Mild on the skin</dt>
                <dd>A soothing blend developed for an adult man's intimate skin.</dd>
              </div>
            </dl>
            <a href="#order" className="btn" onClick={toOrder}>Get my cream</a>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap split split-art">
          <div>
            <h2>Ready in three easy steps</h2>
            <ol className="steps">
              <li>
                <h3>Clean</h3>
                <p>Wash the gbola with warm water and dry it gently.</p>
              </li>
              <li>
                <h3>Apply</h3>
                <p>Rub the cream smoothly over the whole gbola and scrotum.</p>
              </li>
              <li>
                <h3>Massage</h3>
                <p>Massage for about 5 minutes so it absorbs properly.</p>
              </li>
            </ol>
            <p className="note">For external use only. Adults only.</p>
          </div>
          <div className="art-frame">
            <Photo src={config.photos.usage} alt={`How to apply ${config.productName}`} fallback={<ApplyArt />} />
          </div>
        </div>
      </section>

      <section className="band band-dark">
        <div className="wrap split split-art">
          <div className="art-plain"><ParcelArt /></div>
          <div>
            <h2>Your private life stays private</h2>
            <ul className="ticks ticks-light">
              <li><Check /> Your order details are kept 100% private.</li>
              <li><Check /> Plain, discreet packaging with nothing written outside.</li>
              <li><Check /> Handed to you by a confidential courier.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="band band-tint">
        <div className="wrap">
          <h2>Real men. Real experiences.</h2>
          <p className="sub">What customers told us after using {config.productName}.</p>
          <div className="reviews">
            {config.reviews.map((r) => (
              <figure key={r.name}>
                <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>{r.text}</blockquote>
                <figcaption><strong>{r.name}</strong>, {r.place}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="band" id="order">
        <div className="wrap">
          <h2>Choose your package</h2>
          <p className="sub">The more tubes you take, the less you pay for each one.</p>

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
                {p.popular && <span className="flag">Most popular</span>}
                <span className="pack-title">{p.title}</span>
                <span className="pack-tag">{p.tag}</span>
                <span className="pack-price">{naira(p.price)}</span>
                <span className="pack-was">{naira(regularFor(p))}</span>
                <span className="pack-save">Save {naira(savingFor(p))} ({percentOff(p)}% off)</span>
                {p.tubes > 1 && <span className="pack-each">{naira(perTube(p))} per tube</span>}
              </button>
            ))}
          </div>

          <OrderForm pkg={pkg} onComplete={onComplete} />
        </div>
      </section>

      <section className="band band-tint">
        <div className="wrap narrow">
          <h2>Questions men ask before ordering</h2>
          <div className="faq">
            <details>
              <summary>Is it only for older men?</summary>
              <p>No. It is for sexually active adult men of any age.</p>
            </details>
            <details>
              <summary>Is it difficult to use?</summary>
              <p>Not at all. Clean and dry the gbola, rub on a good amount, then massage the gbola and scrotum until it absorbs.</p>
            </details>
            <details>
              <summary>Is it safe for my skin?</summary>
              <p>It is a herbal cream for external use, made to be mild on intimate skin. Try a little on a small area first, and stop using it if you notice any irritation.</p>
            </details>
            <details>
              <summary>Does it help with erection?</summary>
              <p>Yes. It is made to support men who struggle with getting and keeping an erection.</p>
            </details>
            <details>
              <summary>Will anyone know what I ordered?</summary>
              <p>No. It comes in plain packaging and our dispatch manager speaks only with you.</p>
            </details>
          </div>
          <a href="#order" className="btn btn-big" onClick={toOrder}>Order my cream now</a>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap narrow">
          <p>
            This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is
            not endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
          </p>
          <p>Results differ from person to person. This product is not intended to diagnose, treat or cure any disease.</p>
          <p>&copy; {new Date().getFullYear()} {config.productName} Nigeria. All rights reserved.</p>
        </div>
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
        <h3>Where should we deliver?</h3>
        <p>Our dispatch manager will call you to confirm delivery.</p>
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
        {status === 'sending' ? 'Placing your order…' : `Place my order: ${naira(pkg.price)}`}
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
      <div className="wrap narrow">
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
