import { useEffect, useMemo, useRef, useState } from 'react'
import { config, naira, regularFor, savingFor, perTube, phonePretty, phoneHref } from './config'
import { track, packageParams } from './pixel'
import { ParcelArt } from './Illustrations'

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

  const toForm = (e) => {
    e.preventDefault()
    document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' })
  }

  const toOrder = (e) => {
    e.preventDefault()
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <p className="topbar">Men's sexual health: discreet support for premature ejaculation</p>

      <main className="letter">
        <p className="pre">Premature ejaculation is one of the most common sexual health concerns in men.</p>

        <h1>
          A herbal, external-use cream made to help men with <mark>premature ejaculation</mark>
        </h1>

        <p className="center big">Applied to the skin. Nothing to swallow, no injections.</p>

        <p className="center deal">
          Today: <s>{naira(regularFor(starter))}</s> <strong className="red">{naira(starter.price)}</strong>
        </p>
        <a href="#order" className="btn" onClick={toOrder}>👉 Order the cream</a>
        <p className="center small">
          {config.nafdacNumber ? `NAFDAC Reg. No. ${config.nafdacNumber}. ` : ''}
          Delivered to your door in plain packaging.
        </p>

        <img className="creative" src={config.photos.hero} alt={`${config.productName} tube and box`} />

        <a href="#order" className="btn" onClick={toOrder}>👉 See today's prices and order</a>
        <CallLine />

        <h2>You are not alone</h2>
        <p>
          Premature ejaculation affects many adult men at some point in their lives. Stress, tiredness
          and anxiety can all play a part. It is a health issue, not a personal failing, and it is
          worth addressing.
        </p>
        <p>Men often tell us they:</p>
        <ul className="list no">
          <li>Feel they have little control over the timing of ejaculation.</li>
          <li>Feel anxious or stressed about it, which can affect their relationship.</li>
          <li>Prefer to try a topical product before oral medication.</li>
          <li>Want something they can buy privately.</li>
        </ul>

        <h2>About {config.productName}</h2>
        <p>
          {config.productName} is a herbal cream for external use, made to help men who experience
          premature ejaculation. It is applied to the skin shortly before intercourse.
        </p>
        <ul className="list yes">
          <li><strong>Topical.</strong> Applied to the skin, with no capsules or tablets.</li>
          <li><strong>Herbal formula.</strong> Made with plant-based ingredients.</li>
          <li><strong>Simple to use.</strong> Clear instructions below.</li>
          <li><strong>Private.</strong> Plain packaging and direct delivery.</li>
        </ul>

        <h2 id="order">Today's prices 👇</h2>
        <p className="center">
          The normal price is <s>{naira(regularFor(starter))}</s> for one. Today you get it for{' '}
          <strong className="red">{naira(starter.price)}</strong>. Buy more and each one gets cheaper.
        </p>

        <div className="packs">
          {config.packages.map((p) => (
            <a key={p.id} href="#order-form" className="pack" onClick={(e) => { choose(p.id); toForm(e) }}>
              <span className="pack-main">
                <span className="pack-title">
                  {p.title} {p.popular && <em>Most popular</em>}
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
            </a>
          ))}
        </div>

        <OrderForm pkg={pkg} pkgId={pkgId} choose={choose} onComplete={onComplete} />

        <img className="creative" src={config.photos.pack} loading="lazy" alt={`${config.productName} packaging`} />

        <h2>How to use it</h2>
        <ol className="steps">
          <li><strong>Wash.</strong> Wash the area with warm water and dry it.</li>
          <li><strong>Apply.</strong> Apply a small amount of cream to the penis.</li>
          <li><strong>Massage.</strong> Massage gently until it absorbs, as directed on the pack.</li>
        </ol>
        <p className="warn">For external use only. For adults 18 and over. Follow the instructions on the pack.</p>

        <h2>Discreet delivery</h2>
        <div className="parcel"><ParcelArt /></div>
        <ul className="list yes">
          <li>Plain packaging with nothing written on the outside.</li>
          <li>Our dispatch team contacts only you.</li>
          <li>Your details are used only for your delivery.</li>
        </ul>

        {hasFeedback && (
          <>
            <h2>What customers tell us</h2>
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

        <h2>Common questions</h2>
        <div className="qa">
          <p className="q">Who is it for?</p>
          <p>Adult men who experience premature ejaculation.</p>
          <p className="q">Is it safe for my skin?</p>
          <p>It is a herbal cream for external use. Test a small amount on a small area first. If it itches, burns or causes irritation, stop using it.</p>
          <p className="q">Should I see a doctor?</p>
          <p>If the problem is persistent, causes distress, or comes with pain or other symptoms, speak to a doctor or pharmacist. They can check for underlying causes and discuss other options.</p>
          <p className="q">Can I use it if I am taking other medicines?</p>
          <p>If you have a medical condition, allergies or take regular medicines, ask a pharmacist or doctor before use.</p>
          <p className="q">Will anyone know what I ordered?</p>
          <p>No. The package is plain and we contact only you.</p>
        </div>

        <a href="#order" className="btn" onClick={toOrder}>👉 Take me to the order form</a>
        <CallLine />
      </main>

      <footer className="footer">
        <p>
          This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is
          not endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
        </p>
        <p>
          Results differ from person to person. This information is not a substitute for advice from a
          doctor or pharmacist. Keep out of reach of children.
        </p>
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

function CallLine() {
  return (
    <p className="call">
      Prefer to talk? Call{' '}
      <a href={phoneHref} onClick={() => track('Contact')}>{phonePretty}</a>
    </p>
  )
}

/* ------------------------------- Order form ------------------------------- */

function OrderForm({ pkg, pkgId, choose, onComplete }) {
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

    // What lands in the inbox: readable labels, plus FormSubmit's own settings (the _ fields).
    const email = {
      _subject: `New order: ${placed.package} from ${form.name}`,
      _template: 'table',
      _captcha: 'false',
      Package: placed.package,
      Name: form.name,
      Phone: form.phone,
      'Other phone': form.phone2 || 'none',
      Address: form.address,
      State: form.state,
      'Ordered at': new Date().toLocaleString('en-NG'),
    }

    const url = config.orderEndpoint || `https://formsubmit.co/ajax/${config.orderEmail}`
    const body = config.orderEndpoint ? placed : email

    setStatus('sending')
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Order service answered ${res.status}`)
      const data = await res.json().catch(() => ({}))
      if (String(data.success) === 'false') throw new Error(data.message || 'Order service refused the order')
      track('Lead', packageParams(pkg))
      onComplete(placed)
    } catch (err) {
      console.error(err)
      setStatus('idle')
      const why = /activat/i.test(err.message)
        ? ' (Order email is not activated yet: open the FormSubmit email in the shop inbox and click Activate.)'
        : ` (${err.message})`
      setError(`Your order did not go through. Check your network and tap the button again, or call ${phonePretty}.${why}`)
    }
  }

  return (
    <form id="order-form" className="order" onSubmit={submit} onFocus={begin}>
      <div className="order-head">
        <h3>Fill this form and we will bring it to you</h3>
        <p>It takes less than a minute. We will contact you to confirm delivery.</p>
      </div>

      <label className="full">
        Package
        <select required value={pkgId} onChange={(e) => choose(e.target.value)}>
          {config.packages.map((p) => (
            <option key={p.id} value={p.id}>{p.title}: {naira(p.price)}</option>
          ))}
        </select>
      </label>

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
      <div className="full"><CallLine /></div>
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
        <img className="thanks-img" src={config.photos.hero} alt={config.productName} />
        <h1>{order ? `Your order has been sent. Thank you, ${order.name.split(' ')[0]}.` : 'Thank you.'}</h1>
        {order ? (
          <>
            <p className="lede">
              We have received your order for <strong>{order.package}</strong>. We will contact you
              soon on <strong>{order.phone}</strong> to confirm delivery, so keep your phone close.
            </p>
            <p className="fine">Your cream arrives in plain, discreet packaging.</p>
          </>
        ) : (
          <p className="lede">If you just placed an order, we will contact you soon to confirm delivery.</p>
        )}
        <a className="btn" href="/">Back to the product page</a>
      </div>
    </main>
  )
}
