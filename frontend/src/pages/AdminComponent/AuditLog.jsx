import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';

// ── config ────────────────────────────────────────────────────────────────────
const actionConfig = {
  "User Login":              { label: "Login",          color: "bg-sky-500/15 text-sky-400 border-sky-500/30",       dot: "bg-sky-400"     },
  "USER_REGISTRATION":       { label: "Registration",   color: "bg-violet-500/15 text-violet-400 border-violet-500/30", dot: "bg-violet-400" },
  "REPORT_SUBMITTED":        { label: "Report Filed",   color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  "INVESTIGATION_ACCEPTED":  { label: "Investigated",   color: "bg-amber-500/15 text-amber-400 border-amber-500/30",   dot: "bg-amber-400"  },
  "User Logout":             { label: "Logout",         color: "bg-slate-500/15 text-slate-400 border-slate-500/30",   dot: "bg-slate-400"  },
};

const getActionConfig = (action) =>
  actionConfig[action] || { label: action || "Unknown", color: "bg-white/10 text-slate-300 border-white/15", dot: "bg-slate-400" };

const fmt = (d) => {
  if (!d) return "—";
  const date = new Date(d?.$date || d);
  if (isNaN(date)) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const initials = (email = "") =>
  (email.split("@")[0] || "?").slice(0, 2).toUpperCase();

// ── helpers to read nested DB fields ─────────────────────────────────────────
const getIp       = (log) => log.userDevise?.ip         || log.ipAddress   || "—";
const getDevice   = (log) => log.userDevise?.device     || log.deviceType  || "—";
const getLocation = (log) => log.userDevise?.location?.fullAddress || log.location || "—";
const getIsp      = (log) => log.userDevise?.network?.isp || log.ispProvider || "—";
const getIsVpn    = (log) => log.userDevise?.security?.isVpn    ?? log.isVpn    ?? false;
const getIsProxy  = (log) => log.userDevise?.security?.isProxy  ?? false;
const getIsTor    = (log) => log.userDevise?.security?.isTor    ?? false;
const getUserAgent= (log) => log.userDevise?.userAgent   || "—";
const getTime     = (log) => log.timestamp?.$date || log.timestamp || log.logintime?.$date || log.logintime;
const getOrg      = (log) => log.userDevise?.network?.organization || "—";
const getCity     = (log) => log.userDevise?.location?.city    || "—";
const getCountry  = (log) => log.userDevise?.location?.country || "—";

const isAlert = (log) => getIsVpn(log) || getIsProxy(log) || getIsTor(log);

// ── sub components ────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, accent }) => (
  <div className={`bg-slate-900/80 border rounded-xl px-5 py-4 flex items-center gap-3 ${accent}`}>
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-2xl font-extrabold text-slate-100 leading-tight">{value}</p>
      <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

const Badge = ({ config }) => (
  <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-semibold border ${config.color}`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
    {config.label}
  </span>
);

const SecurityBadges = ({ log }) => {
  const vpn   = getIsVpn(log);
  const proxy = getIsProxy(log);
  const tor   = getIsTor(log);
  if (!vpn && !proxy && !tor) return (
    <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
      Secure
    </span>
  );
  return (
    <div className="flex flex-wrap gap-1">
      {vpn   && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse flex-shrink-0" />VPN</span>}
      {proxy && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />Proxy</span>}
      {tor   && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />Tor</span>}
    </div>
  );
};

const ExpandedRow = ({ log }) => (
  <div className="px-4 pb-4">
    <div className="bg-slate-800/60 border border-white/6 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "User ID",      value: log.userId || log._id?.$oid || log._id || "—", icon: "🪪" },
        { label: "Organization", value: getOrg(log),          icon: "🏢" },
        { label: "City",         value: getCity(log),         icon: "🏙️" },
        { label: "Country",      value: getCountry(log),      icon: "🌍" },
        { label: "Report ID",    value: log.reportId || "—",  icon: "📋" },
        { label: "Proxy",        value: getIsProxy(log) ? "Yes ⚠" : "No", icon: "🔀" },
        { label: "Tor",          value: getIsTor(log)   ? "Yes ⚠" : "No", icon: "🧅" },
        { label: "User Agent",   value: getUserAgent(log),    icon: "🌐" },
      ].map(({ label, value, icon }) => (
        <div key={label}>
          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-1">{icon} {label}</p>
          <p className="text-slate-300 text-xs font-medium break-all leading-relaxed">{String(value)}</p>
        </div>
      ))}
    </div>
  </div>
);

const PAGE_SIZE = 20;

// ── main component ────────────────────────────────────────────────────────────
const AuditLog = () => {
  const [allLogs,      setAllLogs]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [page,         setPage]         = useState(1);
  const [hasMore,      setHasMore]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filterAction, setFilterAction] = useState("All");
  const [filterSec,    setFilterSec]    = useState("All");
  const [expanded,     setExpanded]     = useState(null);
  const loaderRef = useRef(null);

  // fetch page from API
  const fetchLogs = useCallback(async (pageNum) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/home/admin-dashboard/audit-logs?page=${pageNum}&limit=${PAGE_SIZE}`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      console.log("Fetched audit logs:", response.data);

      // handle both { logs: [...] } and plain array response
      const incoming = Array.isArray(response.data)
        ? response.data
        : response.data.logs || response.data.data || [];

      return incoming;
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return [];
    }
  }, []);

  // initial load
  useEffect(() => {
    setLoading(true);
    fetchLogs(1).then((data) => {
      setAllLogs(data);
      setHasMore(data.length === PAGE_SIZE);
      setLoading(false);
    });
  }, [fetchLogs]);

  // infinite scroll — load more when loaderRef enters viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          const next = page + 1;
          setPage(next);
          setLoadingMore(true);
          fetchLogs(next).then((data) => {
            setAllLogs((prev) => [...prev, ...data]);
            setHasMore(data.length === PAGE_SIZE);
            setLoadingMore(false);
          });
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchLogs]);

  // unique action types from actual data for filter pills
  const actionTypes = useMemo(() =>
    ["All", ...new Set(allLogs.map((l) => l.action || l.actionType).filter(Boolean))],
    [allLogs]
  );

  // filtering
  const filtered = useMemo(() => allLogs.filter((log) => {
    const q = search.toLowerCase();
    const matchQ = !q ||
      (log.userEmail         || "").toLowerCase().includes(q) ||
      (log.userName          || "").toLowerCase().includes(q) ||
      getIp(log).toLowerCase().includes(q) ||
      getLocation(log).toLowerCase().includes(q) ||
      getIsp(log).toLowerCase().includes(q) ||
      (log.reportId          || "").toLowerCase().includes(q) ||
      (log.action            || "").toLowerCase().includes(q) ||
      (log.actionType        || "").toLowerCase().includes(q);
    const matchAction = filterAction === "All" ||
      log.action === filterAction || log.actionType === filterAction;
    const matchSec =
      filterSec === "All" ||
      (filterSec === "VPN"    && getIsVpn(log))   ||
      (filterSec === "Proxy"  && getIsProxy(log)) ||
      (filterSec === "Tor"    && getIsTor(log))   ||
      (filterSec === "Secure" && !isAlert(log));
    return matchQ && matchAction && matchSec;
  }), [allLogs, search, filterAction, filterSec]);

  const alertCount  = allLogs.filter(isAlert).length;
  const loginCount  = allLogs.filter((l) => (l.action || l.actionType) === "User Login").length;
  const reportCount = allLogs.filter((l) => (l.action || l.actionType) === "REPORT_SUBMITTED").length;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">

      {/* ── header ── */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-red-400 mb-2">// Admin Panel</p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Audit{" "}
              <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">Log</span>
              <span className="text-base font-normal text-slate-600 ml-3">
                {loading ? "Loading…" : `${filtered.length} / ${allLogs.length} events`}
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Full chain of custody — every action, device, and network trace.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
            ⬇ Export CSV
          </button>
        </div>
        <div className="h-0.5 w-12 mt-3 rounded-full bg-gradient-to-r from-red-500 to-transparent" />
      </div>

      {/* ── stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Events"   value={loading ? "…" : allLogs.length}  icon="📊" accent="border-white/7" />
        <StatCard label="Logins"         value={loading ? "…" : loginCount}       icon="🔐" accent="border-sky-500/20" />
        <StatCard label="Reports Filed"  value={loading ? "…" : reportCount}      icon="📋" accent="border-emerald-500/20" />
        <StatCard label="Threats 🚨"    value={loading ? "…" : alertCount}        icon="⚠️" accent="border-rose-500/25" />
      </div>

      {/* ── search + filters ── */}
      <div className="bg-slate-900/80 border border-white/6 rounded-2xl p-4 mb-6 flex flex-col gap-3">
        {/* search row */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm opacity-40 pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search email, IP, ISP, location, action…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-xl text-slate-200 text-sm placeholder-slate-600 outline-none focus:border-red-500/40 focus:ring-2 focus:ring-red-500/10 transition-all"
          />
        </div>

        {/* action filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 flex-shrink-0">Event</span>
          {actionTypes.map((a) => {
            const cfg = actionConfig[a];
            return (
              <button key={a} onClick={() => setFilterAction(a)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer
                  ${filterAction === a
                    ? cfg ? cfg.color : "bg-white/10 text-white border-white/25"
                    : "bg-white/3 text-slate-500 border-white/8 hover:border-white/20 hover:text-slate-300"
                  }`}>
                {cfg ? cfg.label : a}
              </button>
            );
          })}
        </div>

        {/* security filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 flex-shrink-0">Security</span>
          {[
            { key: "All",    label: "All",       cls: "bg-white/10 text-white border-white/25" },
            { key: "Secure", label: "✓ Secure",  cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
            { key: "VPN",    label: "⚠ VPN",    cls: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
            { key: "Proxy",  label: "⚠ Proxy",  cls: "bg-orange-500/15 text-orange-300 border-orange-500/30" },
            { key: "Tor",    label: "⚠ Tor",    cls: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
          ].map(({ key, label, cls }) => (
            <button key={key} onClick={() => setFilterSec(key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer
                ${filterSec === key ? cls : "bg-white/3 text-slate-500 border-white/8 hover:border-white/20 hover:text-slate-300"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── table ── */}
      <div className="bg-slate-900/80 border border-white/7 rounded-2xl overflow-hidden">

        {/* header */}
        <div className="grid grid-cols-[2fr_2fr_2fr_1.4fr_1.6fr_0.4fr] px-4 py-3 bg-white/3 border-b border-white/6">
          {["Timestamp & Event", "User", "Network", "Security", "Device & Location", ""].map((h) => (
            <span key={h} className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600 px-2">{h}</span>
          ))}
        </div>

        {/* loading skeleton */}
        {loading && (
          <div className="divide-y divide-white/4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_2fr_2fr_1.4fr_1.6fr_0.4fr] px-4 py-4 gap-0 items-center animate-pulse">
                {[["w-24 h-3", "w-16 h-5 mt-1.5"], ["w-8 h-8 rounded-lg"], ["w-24 h-3", "w-32 h-3 mt-1.5"], ["w-16 h-5"], ["w-16 h-3", "w-24 h-3 mt-1.5"], ["w-3 h-3"]].map((cols, ci) => (
                  <div key={ci} className="px-2 flex flex-col gap-0">
                    {Array.isArray(cols) ? cols.map((c, ii) => (
                      <div key={ii} className={`bg-white/6 rounded ${c}`} />
                    )) : <div className={`bg-white/6 rounded ${cols}`} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* rows */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <span className="text-4xl mb-3 opacity-20">🗂️</span>
                <p className="font-mono text-sm text-slate-600">No log entries match your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-white/4">
                {filtered.map((log) => {
                  const action     = log.action || log.actionType || "Unknown";
                  const cfg        = getActionConfig(action);
                  const isExpanded = expanded === (log._id?.$oid || log._id);
                  const alert      = isAlert(log);

                  return (
                    <div key={log._id?.$oid || log._id}
                      className={`transition-colors ${alert ? "bg-rose-500/4 hover:bg-rose-500/7" : "hover:bg-white/3"}`}>

                      <div
                        className="grid grid-cols-[2fr_2fr_2fr_1.4fr_1.6fr_0.4fr] px-4 py-4 items-center cursor-pointer"
                        onClick={() => setExpanded(isExpanded ? null : (log._id?.$oid || log._id))}
                      >
                        {/* col 1 — time + action */}
                        <div className="px-2">
                          <p className="text-slate-300 text-[11px] font-mono mb-1.5">{fmt(getTime(log))}</p>
                          <Badge config={cfg} />
                        </div>

                        {/* col 2 — user */}
                        <div className="px-2 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-white/8 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                            {initials(log.userEmail || log.userName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-200 text-xs font-semibold truncate">
                              {log.userName || log.userEmail?.split("@")[0] || "—"}
                            </p>
                            <p className="text-slate-500 text-[11px] font-mono truncate">{log.userEmail || "—"}</p>
                          </div>
                        </div>

                        {/* col 3 — network */}
                        <div className="px-2">
                          <p className="text-slate-300 text-xs font-mono">{getIp(log)}</p>
                          <p className="text-slate-500 text-[11px] truncate">{getIsp(log)}</p>
                        </div>

                        {/* col 4 — security */}
                        <div className="px-2">
                          <SecurityBadges log={log} />
                        </div>

                        {/* col 5 — device + location */}
                        <div className="px-2">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm flex-shrink-0">
                              {(getDevice(log) || "").toLowerCase().includes("mobile") ? "📱" : "💻"}
                            </span>
                            <span className="text-slate-300 text-xs truncate">{getDevice(log)}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] truncate">📍 {getLocation(log)}</p>
                        </div>

                        {/* col 6 — expand toggle */}
                        <div className="px-2 flex justify-center">
                          <span className={`text-slate-500 text-[10px] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                        </div>
                      </div>

                      {isExpanded && <ExpandedRow log={log} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── infinite scroll trigger ── */}
            <div ref={loaderRef} className="py-4 flex justify-center border-t border-white/5">
              {loadingMore && (
                <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                  <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
                  Loading more…
                </div>
              )}
              {!hasMore && allLogs.length > 0 && (
                <p className="text-slate-700 text-[11px] font-mono uppercase tracking-widest">
                  ✓ All {allLogs.length} entries loaded
                </p>
              )}
            </div>
          </>
        )}

        {/* table footer */}
        <div className="px-6 py-3 border-t border-white/6 bg-black/10 flex items-center justify-between">
          <p className="font-mono text-[10px] text-slate-700 uppercase tracking-widest">
            Showing {filtered.length} of {allLogs.length} entries
          </p>
          {alertCount > 0 && (
            <p className="text-rose-400 text-[11px] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              {alertCount} threat{alertCount > 1 ? "s" : ""} detected
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLog;