'use client';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [journey, setJourney] = useState(null);
  const [error, setError] = useState(null);

  async function discover() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setJourney(null);
    try {
      const res = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setJourney(data.journey);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: 'Georgia, serif', background: '#F7F4EF', minHeight: '100vh', color: '#0D0D0D' }}>
      <header style={{ borderBottom: '2px solid #0D0D0D', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Wandermind</div>
          <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6B6B6B' }}>AI Travel Intelligence</div>
        </div>
        <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B7043', border: '1px solid #8B7043', padding: '4px 10px' }}>Powered by Claude</div>
      </header>

      <section style={{ maxWidth: '900px', margin: '60px auto', padding: '0 32px' }}>
        <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8B7043', marginBottom: '16px' }}>The world, personalised</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '56px', fontWeight: '600', lineHeight: '1.05', letterSpacing: '-0.02em', marginBottom: '40px' }}>
          Travel that knows<br />your <em style={{ color: '#8B7043' }}>soul</em>
        </h1>
        <label style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6B6B6B', display: 'block', marginBottom: '12px' }}>
          Where does your soul want to go?
        </label>
        <div style={{ borderTop: '2px solid #0D0D0D', borderBottom: '2px solid #0D0D0D', padding: '22px 0', marginBottom: '16px' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); discover(); }}}
            placeholder="Somewhere with old light and no itinerary. Maybe mountains. Maybe silence..."
            rows={3}
            spellCheck={true}
            style={{ width: '100%', fontFamily: 'Georgia, serif', fontSize: '24px', fontStyle: 'italic', color: '#0D0D0D', background: 'transparent', border: 'none', outline: 'none', resize: 'none', caretColor: '#8B7043' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#6B6B6B' }}>Write freely — the more honest, the more precise your journey becomes.</span>
          <button onClick={discover} disabled={loading || !input.trim()} style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#F7F4EF', background: loading ? '#D8D3CB' : '#0D0D0D', border: 'none', padding: '13px 26px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Discovering...' : 'Reveal My Journey →'}
          </button>
        </div>
        {error && <div style={{ marginTop: '24px', color: '#c0392b', fontSize: '13px' }}>Error: {error}</div>}
      </section>

      {journey && (
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px 80px' }}>

          <HeroImage src={journey.heroImage} destination={journey.destination} country={journey.country} />

          <div style={{ background: '#0D0D0D', color: '#F7F4EF', padding: '40px', marginBottom: '3px' }}>
            <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C4A96D', marginBottom: '8px' }}>{journey.archetypeLabel}</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '600', marginBottom: '12px' }}>{journey.profileTitle}</div>
            <p style={{ fontSize: '14px', fontWeight: '300', lineHeight: '1.7', color: '#A09080', maxWidth: '500px', marginBottom: '20px' }}>{journey.profileDesc}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(journey.traits || []).map((t, i) => (
                <span key={i} style={{ fontSize: '9px', fontWeight: '500', letterSpacing: '0.15em', textTransform: 'uppercase', border: '1px solid #2A2A2A', color: '#C4A96D', padding: '5px 11px' }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ background: '#E8E4DF', padding: '48px 40px', marginBottom: '3px' }}>
            <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B7043', marginBottom: '8px' }}>{journey.storyKicker}</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>{journey.country}</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '600', lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: '24px' }}>{journey.destination}</h2>
            <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#6B6B6B', marginBottom: '24px' }}>{journey.tagline}</p>
            {(journey.storyParagraphs || []).map((p, i) => (
              <p key={i} style={{ fontSize: '15px', fontWeight: '300', lineHeight: '1.85', color: '#1E1E1E', marginBottom: '16px' }}>{p}</p>
            ))}
          </div>

          <PhotoGrid photos={journey.gridImages || []} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', marginBottom: '3px' }}>
            {(journey.days || []).map((d, i) => (
              <div key={i} style={{ background: '#F7F4EF', border: '1px solid #D8D3CB', padding: '28px' }}>
                <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B7043', marginBottom: '8px' }}>{d.dayLabel}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', marginBottom: '10px' }}>{d.title}</div>
                <p style={{ fontSize: '12px', fontWeight: '300', lineHeight: '1.75', color: '#6B6B6B', marginBottom: '14px' }}>{d.body}</p>
                <div style={{ fontSize: '11px', fontWeight: '500', color: '#0D0D0D', paddingTop: '12px', borderTop: '1px solid #D8D3CB' }}>✦ {d.highlight}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3px', marginBottom: '3px' }}>
            {(journey.moods || []).map((m, i) => (
              <div key={i} style={{ background: m.accent ? '#8B7043' : '#0D0D0D', padding: '28px', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.3em', textTransform: 'uppercase', color: m.accent ? 'rgba(255,255,255,0.75)' : '#C4A96D', marginBottom: '5px' }}>{m.label}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600', color: '#F7F4EF', marginBottom: '5px' }}>{m.emoji} {m.title}</div>
                <div style={{ fontSize: '11px', fontWeight: '300', color: m.accent ? 'rgba(255,255,255,0.7)' : '#777', lineHeight: '1.55' }}>{m.detail}</div>
              </div>
            ))}
          </div>

          <div style={{ border: '1px solid #D8D3CB', padding: '24px 28px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px' }}>◈</span>
            <div>
              <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B7043', marginBottom: '5px' }}>Why This Journey</div>
              <div style={{ fontSize: '13px', fontWeight: '300', lineHeight: '1.75', color: '#1E1E1E', fontStyle: 'italic' }}>{journey.insight}</div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button onClick={() => { setJourney(null); setInput(''); window.scrollTo({top:0,behavior:'smooth'}); }} style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#0D0D0D', background: 'transparent', border: '1px solid #0D0D0D', padding: '13px 26px', cursor: 'pointer' }}>
              New Journey →
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function HeroImage({ src, destination, country }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', height: '480px', marginBottom: '3px', overflow: 'hidden', background: '#1a1a1a' }}>
      {src && (
        <img src={src} alt={destination} onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 1s ease' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 40px' }}>
        <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-block', padding: '4px 12px', marginBottom: '10px' }}>{country}</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '56px', fontWeight: '700', color: '#fff', lineHeight: '1', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>{destination}</div>
      </div>
    </div>
  );
}

function PhotoGrid({ photos }) {
  if (!photos || photos.length === 0) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '240px 240px', gap: '3px', marginBottom: '3px' }}>
      {photos[0] && (
        <div style={{ gridRow: '1/3', overflow: 'hidden' }}>
          <img src={photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            onMouseEnter={e => e.target.style.transform='scale(1.04)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
        </div>
      )}
      {photos[1] && (
        <div style={{ overflow: 'hidden' }}>
          <img src={photos[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            onMouseEnter={e => e.target.style.transform='scale(1.04)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
        </div>
      )}
      {photos[2] && (
        <div style={{ overflow: 'hidden' }}>
          <img src={photos[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            onMouseEnter={e => e.target.style.transform='scale(1.04)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
        </div>
      )}
    </div>
  );
}