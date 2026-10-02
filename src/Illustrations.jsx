import { useState } from 'react'

// A real photo with an illustrated fallback, so the page never shows a broken image.
export function Photo({ src, alt, fallback, className = '', eager = false }) {
  const [failed, setFailed] = useState(!src)
  if (failed) return <div className={`art ${className}`}>{fallback}</div>
  return (
    <img
      className={`photo ${className}`}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  )
}

export function TubeArt({ count = 1 }) {
  const tubes = Array.from({ length: Math.min(count, 4) })
  const spread = 46
  const start = 160 - ((tubes.length - 1) * spread) / 2
  return (
    <svg viewBox="0 0 320 360" role="img" aria-label={`Illustration of ${count} tube${count > 1 ? 's' : ''} of Men's Prolong Cream`}>
      <defs>
        <linearGradient id="tubeBody" x1="0" x2="1">
          <stop offset="0" stopColor="#0B1638" />
          <stop offset=".45" stopColor="#24409E" />
          <stop offset="1" stopColor="#0B1638" />
        </linearGradient>
        <linearGradient id="tubeCap" x1="0" x2="1">
          <stop offset="0" stopColor="#C98600" />
          <stop offset=".5" stopColor="#FFD166" />
          <stop offset="1" stopColor="#C98600" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="330" rx="120" ry="14" fill="#0B1638" opacity=".12" />
      {tubes.map((_, i) => {
        const x = start + i * spread
        const lift = tubes.length > 1 ? Math.abs(i - (tubes.length - 1) / 2) * 10 : 0
        return (
          <g key={i} transform={`translate(${x - 44} ${28 + lift})`}>
            <path d="M6 0h76l-6 14H12z" fill="#16286B" />
            <path d="M12 14h64l10 220H2z" fill="url(#tubeBody)" />
            <rect x="14" y="74" width="60" height="96" rx="4" fill="#FFF9EE" />
            <rect x="20" y="82" width="48" height="5" rx="2.5" fill="#0B8A4B" />
            <text x="44" y="108" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="11" fill="#0B1638">MEN'S</text>
            <text x="44" y="125" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="11" fill="#1F4BFF">PROLONG</text>
            <text x="44" y="142" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="11" fill="#0B1638">CREAM</text>
            <rect x="26" y="152" width="36" height="4" rx="2" fill="#0B1638" opacity=".25" />
            <path d="M22 234h44v14H22z" fill="#16286B" />
            <rect x="18" y="248" width="52" height="40" rx="6" fill="url(#tubeCap)" />
          </g>
        )
      })}
    </svg>
  )
}

export function ParcelArt() {
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label="Illustration of a plain, unmarked delivery parcel">
      <ellipse cx="160" cy="214" rx="120" ry="12" fill="#000" opacity=".25" />
      <path d="M60 86l100-40 100 40v96l-100 40-100-40z" fill="#C89B62" />
      <path d="M60 86l100 40v96L60 182z" fill="#B3854E" />
      <path d="M160 126l100-40v96l-100 40z" fill="#D9AE76" />
      <path d="M108 66l100 40v34l-18 7v-33L90 74z" fill="#F3E3C6" />
      <rect x="182" y="150" width="56" height="30" rx="3" transform="skewY(-21.8)" fill="#FFF9EE" opacity=".9" />
      <g transform="translate(232 40)">
        <circle r="28" fill="#0B8A4B" />
        <path d="M-9-2v-6a9 9 0 0 1 18 0v6h3v16h-24V-2zm5 0h8v-6a4 4 0 0 0-8 0z" fill="#fff" />
      </g>
    </svg>
  )
}

export function ApplyArt() {
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label="Illustration of cream being squeezed from the tube onto a fingertip">
      <circle cx="160" cy="120" r="104" fill="#E8EEFF" />
      <g transform="rotate(-38 150 110)">
        <rect x="118" y="20" width="64" height="120" rx="6" fill="#16286B" />
        <rect x="126" y="46" width="48" height="60" rx="3" fill="#FFF9EE" />
        <rect x="132" y="54" width="36" height="5" rx="2.5" fill="#0B8A4B" />
        <rect x="132" y="68" width="36" height="6" rx="3" fill="#1F4BFF" />
        <rect x="132" y="82" width="26" height="5" rx="2.5" fill="#0B1638" opacity=".3" />
        <path d="M136 140h28l-4 16h-20z" fill="#FFB000" />
      </g>
      <path d="M214 150c10-4 20 2 22 10s-6 14-16 14-14-6-12-14 2-8 6-10z" fill="#fff" stroke="#C9D4F5" strokeWidth="3" />
      <path d="M150 232c0-34 20-56 52-60 18-2 34 6 40 20l-34 40z" fill="#8A5A3C" />
      <path d="M204 172c14-4 30 2 38 20" fill="none" stroke="#6E452B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Check() {
  return (
    <svg className="check" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
