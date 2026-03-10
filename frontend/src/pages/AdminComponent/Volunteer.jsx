import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthContext'

// ── Status pill colours ──────────────────────────────────────────────────────
const statusStyle = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'active')   return { bg: 'rgba(52,211,153,0.12)', color: '#34d399', dot: '#34d399' }
  if (s === 'inactive') return { bg: 'rgba(248,113,113,0.12)', color: '#f87171', dot: '#f87171' }
  return                       { bg: 'rgba(148,163,184,0.10)', color: '#94a3b8', dot: '#94a3b8' }
}

// ── Avatar initials ──────────────────────────────────────────────────────────
const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'

// ── Hue from name (deterministic accent per card) ────────────────────────────
const hueFromName = (name = '') => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return h
}

// ── Single info row ──────────────────────────────────────────────────────────
const Row = ({ icon, label, value }) => (
  <div style={rowStyle}>
    <span style={rowIcon}>{icon}</span>
    <span style={rowLabel}>{label}</span>
    <span style={rowValue}>{value || '—'}</span>
  </div>
)

// ── Volunteer card ───────────────────────────────────────────────────────────
const VolunteerCard = ({ elem, index }) => {
  const hue   = hueFromName(elem.name)
  const st    = statusStyle(elem.status)
  const delay = `${index * 80}ms`

  return (
    <div className="vol-card" style={{ '--hue': hue, animationDelay: delay }}>
      {/* top accent bar */}
      <div style={{ height: 3, background: `hsl(${hue},70%,60%)`, borderRadius: '16px 16px 0 0' }} />

      <div style={{ padding: '24px 22px 20px' }}>
        {/* avatar + name + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, hsl(${hue},65%,30%), hsl(${hue},65%,20%))`,
            border: `2px solid hsl(${hue},60%,45%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, fontWeight: 700, color: `hsl(${hue},80%,80%)`,
            fontFamily: "'Syne', sans-serif",
          }}>
            {initials(elem.name)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0',
              fontFamily: "'Syne', sans-serif", whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {elem.name}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2,
              fontFamily: "'DM Mono', monospace", textTransform: 'uppercase',
              letterSpacing: '0.08em' }}>
              {elem.role || 'Volunteer'}
            </div>
          </div>

          {/* status badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: st.bg, borderRadius: 20,
            padding: '3px 10px 3px 8px', flexShrink: 0,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%',
              background: st.dot, display: 'inline-block',
              boxShadow: `0 0 5px ${st.dot}` }} />
            <span style={{ fontSize: 11, color: st.color,
              fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
              {elem.status || 'Unknown'}
            </span>
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 16 }} />

        {/* info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <Row icon="✉️" label="Email"   value={elem.email} />
          <Row icon="📞" label="Contact" value={elem.contectNumber} />
          <Row icon="📍" label="Address" value={elem.address} />
        </div>
      </div>
    </div>
  )
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ ...skeletonBase }}>
    <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: '16px 16px 0 0' }} />
    <div style={{ padding: '24px 22px' }}>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, width: '60%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 8 }} />
          <div style={{ height: 10, width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
        </div>
      </div>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginBottom: 10, width: `${70 + i * 7}%` }} />
      ))}
    </div>
  </div>
)

// ── Main component ───────────────────────────────────────────────────────────
const Volunteer = () => {
  const [volunteerData, setVolunteerData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const token = useContext(AuthContext)

  useEffect(() => {
    const volunteerGet = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/home/admin-dashboard/volunteer',
          { withCredentials: true, headers: { 'Content-Type': 'application/json', Authorization: token.token } }
        )
        setVolunteerData(response.data.volunteer)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    volunteerGet()
  }, [])

  const filtered = volunteerData.filter(v =>
    [v.name, v.email, v.role, v.address].some(f =>
      (f || '').toLowerCase().includes(search.toLowerCase())
    )
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .vol-root {
          font-family: 'Syne', sans-serif;
          background: #070b12;
          min-height: 100vh;
          padding: 44px 32px 60px;
          position: relative;
          overflow: hidden;
        }

        .vol-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }

        .vol-card {
          background: rgba(13, 20, 35, 0.85);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          opacity: 0;
          animation: cardIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .vol-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.13);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
        }

        @keyframes cardIn {
          from { opacity:0; transform: translateY(20px) scale(0.97); }
          to   { opacity:1; transform: translateY(0)   scale(1); }
        }

        .search-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          padding: 10px 16px 10px 40px;
          outline: none;
          width: 260px;
          transition: border-color 0.2s, background 0.2s;
        }
        .search-input::placeholder { color: #475569; }
        .search-input:focus {
          border-color: rgba(56,189,248,0.4);
          background: rgba(56,189,248,0.05);
        }

        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
      `}</style>

      <div className="vol-root">
        {/* ambient orbs */}
        <div className="vol-orb" style={{ width:500,height:500, background:'rgba(56,189,248,0.05)', top:-150, left:-150 }} />
        <div className="vol-orb" style={{ width:350,height:350, background:'rgba(139,92,246,0.05)', bottom:-100, right:0 }} />

        {/* ── header ── */}
        <div style={{ position:'relative', zIndex:1, marginBottom:36 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11,
                letterSpacing:'0.22em', textTransform:'uppercase',
                color:'#38bdf8', marginBottom:6 }}>
                Admin Dashboard
              </p>
              <h1 style={{ fontSize:32, fontWeight:800, color:'#f0f6ff',
                letterSpacing:'-0.02em', lineHeight:1 }}>
                Volunteers
                <span style={{ color:'transparent', background:'linear-gradient(90deg,#38bdf8,#818cf8)',
                  WebkitBackgroundClip:'text', backgroundClip:'text', marginLeft:10 }}>
                  {!loading && `(${filtered.length})`}
                </span>
              </h1>
            </div>

            {/* search */}
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)',
                fontSize:14, pointerEvents:'none', opacity:0.5 }}>🔍</span>
              <input
                className="search-input"
                placeholder="Search volunteers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ height:2, width:56, marginTop:14,
            background:'linear-gradient(90deg,#38bdf8,transparent)' }} />
        </div>

        {/* ── grid ── */}
        <div style={{ position:'relative', zIndex:1,
          display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>

          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
            : filtered.length > 0
              ? filtered.map((elem, i) => <VolunteerCard key={elem._id || i} elem={elem} index={i} />)
              : (
                <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px 0',
                  color:'#334155', fontFamily:"'DM Mono',monospace", fontSize:13 }}>
                  No volunteers found.
                </div>
              )
          }
        </div>
      </div>
    </>
  )
}

// ── Shared styles (outside component to avoid recreation) ────────────────────
const rowStyle = {
  display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
}
const rowIcon  = { fontSize: 13, flexShrink: 0, opacity: 0.7 }
const rowLabel = { color: '#475569', fontFamily: "'DM Mono',monospace",
  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', width: 58, flexShrink: 0 }
const rowValue = { color: '#94a3b8', flex: 1, whiteSpace: 'nowrap',
  overflow: 'hidden', textOverflow: 'ellipsis' }
const skeletonBase = {
  background: 'rgba(13,20,35,0.7)', border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 16,
}

export default Volunteer