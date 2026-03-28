import React, { useContext, useEffect, useState, useRef, useMemo } from 'react'
import axios from 'axios'
import { AuthContext } from '../AuthContext'

// ── static maps ───────────────────────────────────────────────────────────────
const priorityBadge = {
  High:   'bg-red-500/15 text-red-400 border border-red-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  Low:    'bg-green-500/15 text-green-400 border border-green-500/30',
}
const statusBadge = {
  Open:          'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  Investigating: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  Closed:        'bg-slate-500/15 text-slate-400 border border-slate-500/30',
}
const statusStrip = {
  Open:          'from-sky-400',
  Investigating: 'from-violet-400',
  Closed:        'from-slate-500',
}

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

// ── reusable info row ─────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-white/6 pb-2 gap-3">
    <span className="text-slate-500 text-xs font-mono flex-shrink-0">{label}</span>
    <span className="text-slate-300 text-sm text-right">{value || '—'}</span>
  </div>
)

// ── filter chip ───────────────────────────────────────────────────────────────
const Chip = ({ label, active, onClick, activeClass }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer
      ${active
        ? activeClass || 'bg-sky-500/20 text-sky-300 border-sky-500/50'
        : 'bg-white/3 text-slate-500 border-white/8 hover:border-white/20 hover:text-slate-300'
      }`}
  >
    {label}
  </button>
)

const CrimeRepository = () => {
  const [report, setReport] = useState([])
  const [view, setView]     = useState(null)
  const [loading, setLoading] = useState(true)
  const token = useContext(AuthContext)
  const formRef = useRef()

  // filter state
  const [query,    setQuery]    = useState('')
  const [status,   setStatus]   = useState('All')
  const [priority, setPriority] = useState('All')
  const [type,     setType]     = useState('All')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const getReports = async () => {
      const reportinfo = await axios.get("http://localhost:3000/home/crime-repository", { withCredentials: true }, {
        headers: { "Content-Type": "application/json", Authorization: token.token }
      })
      console.log(reportinfo.data)
      setReport(reportinfo.data.report)
      setLoading(false)
    }
    getReports()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <p className="text-slate-500 font-mono text-sm animate-pulse">Loading cases…</p>
    </div>
  )

  const investigation = async (r) => {
    const id = r._id
    const report = await axios.patch("http://localhost:3000/home/crime-repository/investigation", { id, token }, { withCredentials: true }, {
      headers: { "Content-Type": "application/json", Authorization: token.token }
    })
    if (report.data.status === "succes") {
      alert(report.data.message)
    } else {
      alert(report.data.message)
      console.log(report.data.message, 'alert')
    }
  }

  const joinJnvestigation = async (r) => {
    const id = r._id
    const report = await axios.patch("http://localhost:3000/home/crime-repository/joininvestigation", { id, token }, { withCredentials: true }, {
      headers: { "Content-Type": "application/json", Authorization: token.token }
    })
  }

  // dynamic options
  const types      = ['All', ...new Set(report.map(r => r.crimeType).filter(Boolean))]
  const categories = ['All', ...new Set(report.map(r => r.crimeCategory).filter(Boolean))]

  // filtered list
  const filtered = report.filter(r => {
    const q = query.toLowerCase()
    const matchQ = !q ||
      (r.name        || '').toLowerCase().includes(q) ||
      (r.email       || '').toLowerCase().includes(q) ||
      (r.location    || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      (r.submitedBy  || '').toLowerCase().includes(q)
    return matchQ
      && (status   === 'All' || r.status        === status)
      && (priority === 'All' || r.priority      === priority)
      && (type     === 'All' || r.crimeType     === type)
      && (category === 'All' || r.crimeCategory === category)
  })

  const hasFilter = query || status !== 'All' || priority !== 'All' || type !== 'All' || category !== 'All'
  const clearAll  = () => { setQuery(''); setStatus('All'); setPriority('All'); setType('All'); setCategory('All') }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">

      {/* ── header ── */}
      <div className="mb-7">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-red-400 mb-2">// Database</p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Crime{' '}
            <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">
              Repository
            </span>
            <span className="text-base font-normal text-slate-600 ml-3">
              {filtered.length}/{report.length} cases
            </span>
          </h1>

          {/* quick status counters */}
          <div className="flex gap-2">
            {['Open', 'Investigating', 'Closed'].map(s => {
              const cnt = report.filter(r => r.status === s).length
              return cnt > 0 && (
                <button key={s} onClick={() => setStatus(status === s ? 'All' : s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                    ${statusBadge[s]}
                    ${status === s ? 'ring-2 ring-offset-1 ring-offset-slate-950 ring-current scale-105' : 'opacity-60 hover:opacity-100'}`}>
                  {cnt} {s}
                </button>
              )
            })}
          </div>
        </div>
        <div className="h-0.5 w-12 mt-3 rounded-full bg-gradient-to-r from-red-500 to-transparent" />
      </div>

      {/* ── search ── */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-40 pointer-events-none">🔍</span>
        <input
          type="text"
          placeholder="Search by name, email, location, description…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/4 border border-white/8 text-slate-200 text-sm placeholder-slate-600 outline-none focus:border-red-500/40 focus:bg-red-500/4 focus:ring-2 focus:ring-red-500/10 transition-all"
        />
      </div>

      {/* ── filter panel ── */}
      {/* <div className="bg-slate-900/80 border border-white/6 rounded-2xl p-4 mb-6 flex flex-col gap-3">

        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 w-16 flex-shrink-0">Status</span>
          {['All', 'Open', 'Investigating', 'Closed'].map(s => (
            <Chip key={s} label={s} active={status === s} onClick={() => setStatus(s)}
              activeClass={
                s === 'Open'          ? 'bg-sky-500/20 text-sky-300 border-sky-500/50' :
                s === 'Investigating' ? 'bg-violet-500/20 text-violet-300 border-violet-500/50' :
                s === 'Closed'        ? 'bg-slate-500/20 text-slate-300 border-slate-500/50' :
                                        'bg-sky-500/20 text-sky-300 border-sky-500/50'
              } />
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 w-16 flex-shrink-0">Priority</span>
          {['All', 'High', 'Medium', 'Low'].map(p => (
            <Chip key={p} label={p} active={priority === p} onClick={() => setPriority(p)}
              activeClass={
                p === 'High'   ? 'bg-red-500/20 text-red-300 border-red-500/50' :
                p === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
                p === 'Low'    ? 'bg-green-500/20 text-green-300 border-green-500/50' :
                                  'bg-sky-500/20 text-sky-300 border-sky-500/50'
              } />
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 w-16 flex-shrink-0">Type</span>
          {types.map(t => (
            <Chip key={t} label={t} active={type === t} onClick={() => setType(t)}
              activeClass="bg-indigo-500/20 text-indigo-300 border-indigo-500/50" />
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 w-16 flex-shrink-0">Category</span>
          {categories.map(c => (
            <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)}
              activeClass="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50" />
          ))}
        </div>

        {hasFilter && (
          <div className="pt-2 border-t border-white/5">
            <button onClick={clearAll}
              className="font-mono text-[11px] text-red-400 bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-1 hover:bg-red-500/15 transition-all cursor-pointer">
              ✕ Clear all filters
            </button>
          </div>
        )}
      </div> */}

      {/* ── grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <span className="text-5xl mb-4 opacity-20">🗂️</span>
          <p className="font-mono text-sm text-slate-600">No cases match your filters</p>
          {hasFilter && (
            <button onClick={clearAll} className="mt-3 text-xs text-red-400 underline cursor-pointer">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <div key={r._id}
              className="bg-slate-900/90 border border-white/7 rounded-2xl flex flex-col hover:-translate-y-1 hover:border-white/15 hover:shadow-xl hover:shadow-black/50 transition-all duration-200 overflow-hidden">

              {/* status colour strip */}
              <div className={`h-[3px] w-full bg-gradient-to-r ${statusStrip[r.status] || statusStrip.Closed} to-transparent`} />

              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* name + status + date */}
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="text-slate-100 font-bold text-[15px] truncate">{r.name}</h3>
                    <p className="text-slate-500 text-[11px] font-mono truncate mt-0.5">{r.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusBadge[r.status] || statusBadge.Closed}`}>
                      {r.status}
                    </span>
                    <span className="text-slate-600 text-[10px] font-mono">{fmt(r.date)}</span>
                  </div>
                </div>

                {/* tags */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                    {r.crimeType}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/25">
                    {r.crimeCategory}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${priorityBadge[r.priority] || priorityBadge.Low}`}>
                    ⚡ {r.priority}
                  </span>
                </div>

                {/* priority + submittedby */}
                <p className="text-slate-600 text-[11px] font-mono">by {r.submitedBy}</p>

                {/* description */}
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{r.description}</p>
              </div>

              {/* card footer */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-t border-white/5">
                <button onClick={() => setView(r)}
                  className="px-4 py-1.5 rounded-xl text-sm font-medium text-sky-300 bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500/25 transition-all cursor-pointer">
                  View
                </button>
                {r.status === "Open"
                  ? <button onClick={() => investigation(r)}
                      className="px-4 py-1.5 rounded-xl text-sm font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer">
                      Investigate
                    </button>
                  : <button onClick={() => joinJnvestigation(r)}
                      className="px-4 py-1.5 rounded-xl text-sm font-medium text-violet-300 bg-violet-500/15 border border-violet-500/30 hover:bg-violet-500/25 transition-all cursor-pointer">
                      Join Investigate
                    </button>
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── detail modal ── */}
      {view && (
        <div onClick={() => setView(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">

          <div onClick={(e) => e.stopPropagation()}
            className="w-[min(880px,94vw)] max-h-[90vh] overflow-y-auto bg-slate-950 border border-white/10 rounded-2xl flex flex-col shadow-2xl shadow-black/60">

            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/7">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400 mb-1">Report Details</p>
                <h2 className="text-slate-100 text-xl font-bold">{view.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge[view.status] || statusBadge.Closed}`}>
                  {view.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityBadge[view.priority] || priorityBadge.Low}`}>
                  {view.priority}
                </span>
              </div>
            </div>

            {/* two columns */}
            <div className="grid grid-cols-2 gap-4 p-6">
              {/* victim */}
              <div>
                <p className="text-indigo-400 font-semibold text-sm mb-3">👤 Victim Information</p>
                <div className="bg-white/3 border border-white/7 rounded-xl p-4 flex flex-col gap-3">
                  <InfoRow label="Name"    value={view.name} />
                  <InfoRow label="Age"     value={view.age} />
                  <InfoRow label="Gender"  value={view.gender} />
                  <InfoRow label="Contact" value={view.contact} />
                  <InfoRow label="Email"   value={view.email} />
                  <InfoRow label="Address" value={view.victimAddress} />
                </div>
              </div>

              {/* crime */}
              <div>
                <p className="text-indigo-400 font-semibold text-sm mb-3">🔍 Crime Information</p>
                <div className="bg-white/3 border border-white/7 rounded-xl p-4 flex flex-col gap-3">
                  <InfoRow label="Crime Type"   value={view.crimeType} />
                  <InfoRow label="Category"     value={view.crimeCategory} />
                  <InfoRow label="Priority"     value={view.priority} />
                  <InfoRow label="Location"     value={view.location} />
                  <InfoRow label="Date"         value={view.crimeDate} />
                  <InfoRow label="Submitted By" value={view.submitedBy} />
                </div>
              </div>
            </div>

            {/* description */}
            <div className="px-6 pb-5">
              <p className="text-indigo-400 font-semibold text-sm mb-2">📋 Detailed Description</p>
              <div className="bg-white/3 border border-white/7 rounded-xl p-4">
                <p className="text-slate-400 text-sm leading-relaxed">{view.description}</p>
              </div>
            </div>

            {/* modal footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/7 bg-black/20 rounded-b-2xl">
              {view.status === "Open"
                ? <button onClick={() => investigation(view)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer">
                    ✓ Investigate
                  </button>
                : <button onClick={() => investigation(view)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-violet-300 bg-violet-500/15 border border-violet-500/30 hover:bg-violet-500/25 transition-all cursor-pointer">
                    + Join Investigate
                  </button>
              }
              <button onClick={() => setView(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                પાછળ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrimeRepository