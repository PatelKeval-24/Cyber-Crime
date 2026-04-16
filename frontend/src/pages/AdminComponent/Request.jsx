import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthContext'

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'

const hueFromName = (name = '') => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return h
}

// ── Single request row ───────────────────────────────────────────────────────
const RequestRow = ({ user, onApprove, onReject, index }) => {
  const [status, setStatus] = useState(null) // null | 'approving' | 'rejecting'
  const hue = hueFromName(user.name)

  const handleApprove = async () => {
    setStatus('approving')
    await onApprove(user)
  }
  const handleReject = async () => {
    setStatus('rejecting')
    await onReject(user)
  }

  return (
    <div
      className="req-row"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* left accent */}
      <div style={{
        width: 3, alignSelf: 'stretch', borderRadius: 4, flexShrink: 0,
        background: `linear-gradient(180deg, hsl(${hue},65%,55%), hsl(${hue},65%,35%))`,
      }} />

      {/* avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg,hsl(${hue},60%,28%),hsl(${hue},60%,18%))`,
        border: `1.5px solid hsl(${hue},55%,40%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 700, color: `hsl(${hue},80%,78%)`,
        fontFamily: "'Syne',sans-serif", flexShrink: 0,
      }}>
        {initials(user.name)}
      </div>

      {/* info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0',
          fontFamily: "'Syne',sans-serif", whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user.name}
        </div>
        <div style={{ fontSize: 12, color: '#475569', marginTop: 3,
          fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user.email}
        </div>
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          className="btn-approve"
          onClick={handleApprove}
          disabled={!!status}
        >
          {status === 'approving' ? (
            <span className="btn-spinner" />
          ) : (
            <>
              <span>✓</span>
              <span>Approve</span>
            </>
          )}
        </button>
        <button
          className="btn-reject"
          onClick={handleReject}
          disabled={!!status}
        >
          {status === 'rejecting' ? (
            <span className="btn-spinner" />
          ) : (
            <>
              <span>✕</span>
              <span>Reject</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ i }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    background: 'rgba(13,20,35,0.7)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 14, padding: '14px 18px',
    animationDelay: `${i * 80}ms`,
  }}>
    <div style={{ width: 3, height: 44, borderRadius: 4, background: 'rgba(255,255,255,0.05)', flexShrink:0 }} />
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', flexShrink:0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ height: 13, width: '45%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 8 }} />
      <div style={{ height: 10, width: '65%', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
    </div>
    <div style={{ display:'flex', gap:8 }}>
      <div style={{ width: 88, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ width: 78, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.04)' }} />
    </div>
  </div>
)

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type }) => (
  <div style={{
    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
    background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
    border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
    color: type === 'success' ? '#6ee7b7' : '#fca5a5',
    fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600,
    padding: '12px 20px', borderRadius: 12,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', gap: 8,
    animation: 'toastIn 0.3s cubic-bezier(0.16,1,0.3,1)',
  }}>
    <span>{type === 'success' ? '✓' : '✕'}</span>
    {msg}
  </div>
)

// ── Main ──────────────────────────────────────────────────────────────────────
export const Request = () => {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [toast, setToast]     = useState(null)
  const token = useContext(AuthContext)
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:3000/home/request', {
          headers: { 'Content-Type': 'application/json', Authorization: token.token }
        })
        setData(res.data.result)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const approve = async (user) => {
    try {
      await axios.post('http://localhost:3000/home/request/approved',
        { name: user.name, email: user.email, aprove: 'aproved', latitude, longitude },
        { headers: { 'Content-Type': 'application/json', Authorization: token.token } }
      )
      setData(prev => prev.filter(d => d._id !== user._id))
      showToast(`${user.name} approved successfully`, 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to approve request', 'error')
    }
  }
  //////////////// get user location when admin approve or reject the request
  navigator.geolocation.getCurrentPosition(async(position) => {
      const { latitude, longitude } = position.coords;

      console.log("User Location:", latitude, longitude);
    }, (error) => {
      console.error("User denied location access", error);
    });

  const reject = async (user) => {
    try {
      await axios.post('http://localhost:3000/home/request/rejected',
        { name: user.name, email: user.email, aprove: 'reject', latitude, longitude  },
        { headers: { 'Content-Type': 'application/json', Authorization: token.token } }
      )
      setData(prev => prev.filter(d => d._id !== user._id))
      showToast(`${user.name} rejected`, 'error')
    } catch (e) {
      console.error(e)
    }
  }

  const filtered = data.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .req-root {
          font-family: 'Syne', sans-serif;
          background: #070b12;
          min-height: 100vh;
          padding: 44px 32px 60px;
          position: relative;
          overflow: hidden;
        }

        .req-row {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(13,20,35,0.85);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 14px 18px;
          backdrop-filter: blur(10px);
          opacity: 0;
          animation: rowIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .req-row:hover {
          transform: translateX(4px);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 4px 20px rgba(0,0,0,0.35);
        }

        @keyframes rowIn {
          from { opacity:0; transform:translateX(-16px); }
          to   { opacity:1; transform:translateX(0); }
        }

        .btn-approve, .btn-reject {
          display: flex; align-items: center; gap: 5px;
          padding: 0 14px; height: 34px; border-radius: 10px;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
          border: 1px solid; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-approve {
          background: rgba(16,185,129,0.12);
          border-color: rgba(16,185,129,0.35);
          color: #6ee7b7;
        }
        .btn-approve:hover:not(:disabled) {
          background: rgba(16,185,129,0.22);
          box-shadow: 0 0 16px rgba(16,185,129,0.2);
          transform: translateY(-1px);
        }
        .btn-reject {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #fca5a5;
        }
        .btn-reject:hover:not(:disabled) {
          background: rgba(239,68,68,0.2);
          box-shadow: 0 0 16px rgba(239,68,68,0.2);
          transform: translateY(-1px);
        }
        .btn-approve:disabled, .btn-reject:disabled {
          opacity: 0.4; cursor: not-allowed;
        }

        .btn-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          border-top-color: currentColor;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .req-search {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          padding: 10px 16px 10px 40px;
          outline: none;
          width: 240px;
          transition: border-color 0.2s, background 0.2s;
        }
        .req-search::placeholder { color: #475569; }
        .req-search:focus {
          border-color: rgba(56,189,248,0.4);
          background: rgba(56,189,248,0.05);
        }

        @keyframes toastIn {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .empty-state {
          text-align: center; padding: 72px 0;
          color: #1e293b;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
        .empty-text { font-family: 'DM Mono',monospace; font-size: 13px; color: #334155; }
      `}</style>

      <div className="req-root">
        {/* orbs */}
        <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(90px)', pointerEvents:'none', zIndex:0,
          width:450, height:450, background:'rgba(56,189,248,0.05)', top:-150, left:-100 }} />
        <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(90px)', pointerEvents:'none', zIndex:0,
          width:300, height:300, background:'rgba(239,68,68,0.04)', bottom:-80, right:60 }} />

        {/* header */}
        <div style={{ position:'relative', zIndex:1, marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11,
                letterSpacing:'0.22em', textTransform:'uppercase',
                color:'#38bdf8', marginBottom:6 }}>
                Admin Panel
              </p>
              <h1 style={{ fontSize:32, fontWeight:800, color:'#f0f6ff',
                letterSpacing:'-0.02em', lineHeight:1, margin:0 }}>
                Pending{' '}
                <span style={{ color:'transparent',
                  background:'linear-gradient(90deg,#f87171,#fb923c)',
                  WebkitBackgroundClip:'text', backgroundClip:'text' }}>
                  Requests
                </span>
                {!loading && (
                  <span style={{ fontSize:18, color:'#334155', marginLeft:10, fontWeight:600 }}>
                    ({filtered.length})
                  </span>
                )}
              </h1>
            </div>

            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:13, top:'50%',
                transform:'translateY(-50%)', fontSize:14, pointerEvents:'none', opacity:.45 }}>🔍</span>
              <input
                className="req-search"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div style={{ height:2, width:56, marginTop:14,
            background:'linear-gradient(90deg,#f87171,transparent)' }} />
        </div>

        {/* list */}
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:10 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} i={i} />)
            : filtered.length > 0
              ? filtered.map((user, i) => (
                  <RequestRow
                    key={user._id}
                    user={user}
                    index={i}
                    onApprove={approve}
                    onReject={reject}
                  />
                ))
              : (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <div className="empty-text">No pending requests found</div>
                </div>
              )
          }
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  )
}

export default Request