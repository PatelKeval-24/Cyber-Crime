import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthContext'

// ── Avatar initials ──────────────────────────────────────────────────────────
const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase()
  const styles = {
    active:   'bg-emerald-400/10 border border-emerald-400/25 text-emerald-400',
    inactive: 'bg-rose-400/10 border border-rose-400/25 text-rose-400',
  }
  const dotStyles = {
    active:   'bg-emerald-400 shadow-[0_0_5px_#34d399]',
    inactive: 'bg-rose-400 shadow-[0_0_5px_#f87171]',
  }
  const cls    = styles[s]    || 'bg-slate-400/10 border border-slate-400/20 text-slate-400'
  const dotCls = dotStyles[s] || 'bg-slate-400'

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${dotCls}`} />
      <span className="text-xs font-mono font-medium">{status || 'Unknown'}</span>
    </div>
  )
}

// ── Info row ─────────────────────────────────────────────────────────────────
const Row = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-sm shrink-0 opacity-70">{icon}</span>
    <span className="text-slate-600 font-mono text-xs uppercase tracking-wider w-14 shrink-0">{label}</span>
    <span className="text-slate-400 flex-1 truncate text-xs">{value || '—'}</span>
  </div>
)

// ── Avatar colours based on name (10 preset hues) ────────────────────────────
const avatarColor = (name = '') => {
  const palettes = [
    { bg: 'bg-sky-900/60',    border: 'border-sky-500/60',    text: 'text-sky-300' },
    { bg: 'bg-violet-900/60', border: 'border-violet-500/60', text: 'text-violet-300' },
    { bg: 'bg-emerald-900/60',border: 'border-emerald-500/60',text: 'text-emerald-300' },
    { bg: 'bg-amber-900/60',  border: 'border-amber-500/60',  text: 'text-amber-300' },
    { bg: 'bg-rose-900/60',   border: 'border-rose-500/60',   text: 'text-rose-300' },
    { bg: 'bg-pink-900/60',   border: 'border-pink-500/60',   text: 'text-pink-300' },
    { bg: 'bg-cyan-900/60',   border: 'border-cyan-500/60',   text: 'text-cyan-300' },
    { bg: 'bg-lime-900/60',   border: 'border-lime-500/60',   text: 'text-lime-300' },
    { bg: 'bg-orange-900/60', border: 'border-orange-500/60', text: 'text-orange-300' },
    { bg: 'bg-teal-900/60',   border: 'border-teal-500/60',   text: 'text-teal-300' },
  ]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % palettes.length
  return palettes[h]
}

// ── Top accent bar colours ────────────────────────────────────────────────────
const accentBar = (name = '') => {
  const bars = [
    'bg-gradient-to-r from-sky-400 to-violet-400',
    'bg-gradient-to-r from-violet-400 to-pink-400',
    'bg-gradient-to-r from-emerald-400 to-cyan-400',
    'bg-gradient-to-r from-amber-400 to-orange-400',
    'bg-gradient-to-r from-rose-400 to-pink-400',
    'bg-gradient-to-r from-cyan-400 to-sky-400',
    'bg-gradient-to-r from-lime-400 to-emerald-400',
    'bg-gradient-to-r from-orange-400 to-amber-400',
    'bg-gradient-to-r from-teal-400 to-cyan-400',
    'bg-gradient-to-r from-pink-400 to-rose-400',
  ]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % bars.length
  return bars[h]
}

// ── Volunteer card ────────────────────────────────────────────────────────────
const VolunteerCard = ({ elem, index }) => {
  const av  = avatarColor(elem.name)
  const bar = accentBar(elem.name)

  return (
    <div
      className="bg-gray-900/85 border border-white/7 rounded-2xl backdrop-blur-sm flex flex-col hover:-translate-y-1.5 hover:border-white/13 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* top accent bar */}
      <div className={`h-0.5  rounded-t-4xl ${bar} `} />

      <div className="p-5 ">
        {/* avatar + name + status */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-full shrink-0 border-2 flex items-center justify-center text-base font-bold ${av.bg} ${av.border} ${av.text}`}>
            {initials(elem.name)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-200 truncate">{elem.name}</p>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-600 mt-0.5">
              {elem.role || 'Volunteer'}
            </p>
          </div>

          <StatusBadge status={elem.status} />
        </div>

        {/* divider */}
        <div className="h-px bg-white/5 mb-4" />

        {/* info rows */}
        <div className="flex flex-col gap-2.5">
          <Row icon="✉️" label="Email"   value={elem.email} />
          <Row icon="📞" label="Contact" value={elem.contectNumber} />
          <Row icon="📍" label="Address" value={elem.address} />
        </div>
      </div>
    </div>
  )
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="bg-gray-900/70 border border-white/5 rounded-2xl">
    <div className="h-0.5 bg-white/5 rounded-t-2xl" />
    <div className="p-5">
      <div className="flex gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-white/6 shrink-0" />
        <div className="flex-1">
          <div className="h-3.5 w-3/5 bg-white/6 rounded-md mb-2" />
          <div className="h-2.5 w-2/5 bg-white/4 rounded-md" />
        </div>
      </div>
      <div className="h-px bg-white/5 mb-4" />
      {[80, 65, 75].map((w, i) => (
        <div key={i} className={`h-2.5 bg-white/4 rounded-md mb-2.5`} style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────
const Volunteer = () => {
  const [volunteerData, setVolunteerData] = useState([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
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
    <div className="min-h-screen bg-gray-950 px-8 py-11 relative overflow-hidden">

      {/* ambient orbs */}
      <div className="absolute w-125 h-125 rounded-full bg-sky-400/5 blur-3xl -top-36 -left-36 pointer-events-none" />
      <div className="absolute w-87.5 h-87.5 rounded-full bg-violet-500/5 blur-3xl -bottom-24 right-0 pointer-events-none" />

      {/* ── header ── */}
      <div className="relative z-10 mb-9">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono tracking-[0.22em] uppercase text-sky-400 mb-1.5">
              Admin Dashboard
            </p>
            <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight leading-none">
              Volunteers
              {!loading && (
                <span className="ml-3 text-transparent bg-linear-to-r from-sky-400 to-violet-400 bg-clip-text">
                  ({filtered.length})
                </span>
              )}
            </h1>
          </div>

          {/* search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-50">🔍</span>
            <input
              className="bg-white/5 border border-white/9 rounded-xl text-slate-200 text-sm py-2.5 pl-10 pr-4 outline-none w-64 placeholder-slate-600 focus:border-sky-400/40 focus:bg-sky-400/5 transition-all duration-200"
              placeholder="Search volunteers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3.5 h-0.5 w-14 bg-linear-to-r from-sky-400 to-transparent rounded-full" />
      </div>

      {/* ── grid ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
          : filtered.length > 0
            ? filtered.map((elem, i) => <VolunteerCard key={elem._id || i} elem={elem} index={i} />)
            : (
              <div className="col-span-full text-center py-16 text-slate-700 font-mono text-sm">
                No volunteers found.
              </div>
            )
        }
      </div>
    </div>
  )
}

export default Volunteer