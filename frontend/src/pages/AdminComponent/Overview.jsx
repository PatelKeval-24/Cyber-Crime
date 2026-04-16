import { use } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ── static data (replace with API later) ─────────────────────────────────────
const STATIC_VOLUNTEER = {
  name:        "Mayank Patel",
  email:       "mayank11@gmail.com",
  phone:       "9099122044",
  volunteerId: "69930181c3d15d326ed1e678",
  joinDate:    "Thu Feb 12 2026 11:55:37 GMT+0530 (India Standard Time)",
  role:        "admin",
  status:      "Active",
  isOnline:    false,
  lastSeen:    "2026-04-15T12:48:51.951Z",
  avatar:      null,
};

const STATIC_STATS = {
  adminCount:            5,
  volunteerCount:        11,
  volunteerRequestCount: 1,
  investigationCount:    3,
  pendingCount:          10,
  pendingCount1:         2,
  pendingCount2:         3,
  closedCount:           1,
};

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  } catch { return d || "—"; }
};

const fmtTime = (d) => {
  try {
    return new Date(d).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  } catch { return d || "—"; }
};

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

// ── small components ──────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-white/6 pb-3 gap-4">
    <span className="text-slate-500 text-xs font-mono uppercase tracking-wider flex-shrink-0">{label}</span>
    <span className="text-slate-200 text-sm text-right font-medium">{value || "—"}</span>
  </div>
);

const StatCard = ({ label, value, icon, colorClass, borderClass }) => (
  <div className={`bg-slate-900/80 border rounded-xl px-4 py-4 flex items-center gap-3 ${borderClass}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-extrabold text-slate-100 leading-tight">{value}</p>
      <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

// ── edit profile modal ────────────────────────────────────────────────────────
const EditModal = ({ volunteer, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:  volunteer.name,
    email: volunteer.email,
    phone: volunteer.phone,
  });

  return (
    <div onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">
      <div onClick={(e) => e.stopPropagation()}
        className="w-[min(480px,94vw)] bg-slate-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

        <div className="h-[3px] bg-gradient-to-r from-sky-500 to-indigo-500" />

        <div className="px-6 py-5 border-b border-white/7 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-sky-400 mb-0.5">// Edit</p>
            <h2 className="text-slate-100 text-lg font-bold">Update Profile</h2>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-sm transition-all cursor-pointer">✕</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {[
            { key: "name",  label: "Full Name",     type: "text",  icon: "👤" },
            { key: "email", label: "Email Address", type: "email", icon: "✉️" },
            { key: "phone", label: "Phone Number",  type: "tel",   icon: "📞" },
          ].map(({ key, label, type, icon }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-50">{icon}</span>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/4 border border-white/8 rounded-xl text-slate-200 text-sm outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10 transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-white/7 bg-black/20 flex justify-end gap-2">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={() => onSave(form)}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 shadow-lg shadow-sky-500/20 transition-all cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ── main page ─────────────────────────────────────────────────────────────────
const Overview = () => {
  const [volunteer, setVolunteer] = useState(STATIC_VOLUNTEER);
  const [stats, setStats]         = useState(STATIC_STATS);
  const [showEdit, setShowEdit]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching profile data...");
        const profileRes = await axios.get("http://localhost:3000/home/admin-dashboard/profile");
        console.log("Profile data:", profileRes.data);

        if (profileRes.data?.profileData) {
          const p = profileRes.data.profileData;
          setVolunteer({
            name:        p.name            || STATIC_VOLUNTEER.name,
            email:       p.email           || STATIC_VOLUNTEER.email,
            phone:       p.contactNumber   || STATIC_VOLUNTEER.phone,
            volunteerId: p._id             || STATIC_VOLUNTEER.volunteerId,
            joinDate:    p.registerTime    || STATIC_VOLUNTEER.joinDate,
            role:        p.role            || STATIC_VOLUNTEER.role,
            status:      p.isOnline ? "Online" : "Offline",
            isOnline:    p.isOnline        ?? STATIC_VOLUNTEER.isOnline,
            lastSeen:    p.lastSeen        || STATIC_VOLUNTEER.lastSeen,
            avatar:      null,
          });
          setStats({
            adminCount:            profileRes.data.adminCount            ?? STATIC_STATS.adminCount,
            volunteerCount:        profileRes.data.volunteerCount        ?? STATIC_STATS.volunteerCount,
            volunteerRequestCount: profileRes.data.volunteerRequestCount ?? STATIC_STATS.volunteerRequestCount,
            investigationCount:    profileRes.data.investigationCount    ?? STATIC_STATS.investigationCount,
            pendingCount:          profileRes.data.pendingCount          ?? STATIC_STATS.pendingCount,
            pendingCount1:         profileRes.data.pendingCount1         ?? STATIC_STATS.pendingCount1,
            pendingCount2:         profileRes.data.pendingCount2         ?? STATIC_STATS.pendingCount2,
            closedCount:           profileRes.data.closedCount           ?? STATIC_STATS.closedCount,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to load dashboard data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const profileUpdate = async (updatedData) => {
    try {
      const res = await axios.post("http://localhost:3000/home/admin-dashboard/profile/update", updatedData);
      if (res.data.success) {
        alert("Profile updated successfully!");
        setVolunteer((prev) => ({ ...prev, ...updatedData }));
        setShowEdit(false);
      } else {
        alert("Profile update failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile. Please try again.");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">

      {/* ── page header ── */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-sky-400 mb-2">// Admin Portal</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          My{" "}
          <span className="text-transparent bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text">Dashboard</span>
        </h1>
        <div className="h-0.5 w-12 mt-3 rounded-full bg-gradient-to-r from-sky-500 to-transparent" />
      </div>

      <div className="flex flex-col gap-6">

        {/* ── row 1: system stats ── */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-3">System Overview</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Admins"       value={stats.adminCount}            icon="🛡️" colorClass="bg-sky-500/10"     borderClass="border-sky-500/20" />
            <StatCard label="Volunteers"   value={stats.volunteerCount}        icon="🙌" colorClass="bg-violet-500/10" borderClass="border-violet-500/20" />
            <StatCard label="Requests"     value={stats.volunteerRequestCount} icon="📥" colorClass="bg-orange-500/10" borderClass="border-orange-500/20" />
            <StatCard label="Active Cases" value={stats.investigationCount}    icon="🔍" colorClass="bg-amber-500/10"  borderClass="border-amber-500/20" />
          </div>
        </div>

        {/* ── row 2: report stats ── */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-3">Report Statistics</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Pending Reports"  value={stats.pendingCount}  icon="⏳" colorClass="bg-yellow-500/10"  borderClass="border-yellow-500/20" />
            <StatCard label="Pending Review 1" value={stats.pendingCount1} icon="📋" colorClass="bg-white/5"        borderClass="border-white/7" />
            <StatCard label="Rejcted Volunteer" value={stats.pendingCount2} icon="📄" colorClass="bg-white/5"        borderClass="border-white/7" />
            <StatCard label="Closed Cases"     value={stats.closedCount}   icon="✅" colorClass="bg-emerald-500/10" borderClass="border-emerald-500/20" />
          </div>
        </div>

        {/* ── profile + actions ── */}
        <div className="grid md:grid-cols-3 gap-5">

          {/* profile card */}
          <div className="md:col-span-2 bg-slate-900/90 border border-white/7 rounded-2xl overflow-hidden">
            <div className="h-[3px] bg-gradient-to-r from-sky-500 to-indigo-500" />
            <div className="p-6">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-sky-500/25 flex-shrink-0">
                  {initials(volunteer.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-slate-100 text-xl font-bold truncate">{volunteer.name}</h2>
                  <p className="text-slate-500 text-sm font-mono truncate">{volunteer.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/25 font-medium capitalize">
                      {volunteer.role}
                    </span>
                    {volunteer.isOnline ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-medium">
                        ● Online
                      </span>
                    ) : (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/25 font-medium">
                        ○ Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <InfoRow label="Admin ID"   value={volunteer.volunteerId} />
                <InfoRow label="Email"      value={volunteer.email} />
                <InfoRow label="Phone"      value={volunteer.phone} />
                <InfoRow label="Role"       value={volunteer.role} />
                <InfoRow label="Registered" value={fmt(volunteer.joinDate)} />
                <InfoRow label="Last Seen"  value={fmtTime(volunteer.lastSeen)} />
              </div>
            </div>
          </div>

          {/* action cards */}
          <div className="flex flex-col gap-4">

            {/* edit profile */}
            <button onClick={() => setShowEdit(true)}
              className="flex items-center gap-4 bg-slate-900/90 border border-sky-500/20 hover:border-sky-500/40 rounded-2xl p-5 text-left hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/10 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-sky-500/25 transition-all">✏️</div>
              <div>
                <p className="text-slate-100 text-sm font-bold">Edit Profile</p>
                <p className="text-slate-500 text-xs mt-0.5">Update name, email & phone</p>
              </div>
            </button>

            {/* case progress */}
            <div className="bg-slate-900/90 border border-white/7 rounded-2xl p-5 flex flex-col gap-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Case Progress</p>
              {[
                { label: "Investigations", val: stats.investigationCount, total: stats.investigationCount + stats.closedCount, color: "bg-amber-500" },
                { label: "Pending",        val: stats.pendingCount,       total: stats.pendingCount + stats.closedCount,       color: "bg-yellow-500" },
                { label: "Closed",         val: stats.closedCount,        total: stats.investigationCount + stats.closedCount, color: "bg-emerald-500" },
              ].map(({ label, val, total, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 text-[11px]">{label}</span>
                    <span className="text-slate-500 text-[11px] font-mono">{val}/{total || 1}</span>
                  </div>
                  <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all duration-700`}
                      style={{ width: total > 0 ? `${(val / total) * 100}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* team snapshot */}
            <div className="bg-slate-900/90 border border-violet-500/15 rounded-2xl p-5 flex flex-col gap-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Team Snapshot</p>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-violet-300">{stats.volunteerCount}</p>
                  <p className="text-slate-500 text-[10px] font-mono">Volunteers</p>
                </div>
                <div className="w-px h-8 bg-white/8" />
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-sky-300">{stats.adminCount}</p>
                  <p className="text-slate-500 text-[10px] font-mono">Admins</p>
                </div>
                <div className="w-px h-8 bg-white/8" />
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-orange-300">{stats.volunteerRequestCount}</p>
                  <p className="text-slate-500 text-[10px] font-mono">Requests</p>
                </div>
              </div>
            </div>

            {/* logout */}
            <button onClick={handleLogout}
              className="flex items-center gap-4 bg-slate-900/90 border border-rose-500/20 hover:border-rose-500/40 rounded-2xl p-5 text-left hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/10 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-rose-500/25 transition-all">🚪</div>
              <div>
                <p className="text-rose-300 text-sm font-bold">Logout</p>
                <p className="text-slate-500 text-xs mt-0.5">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showEdit && <EditModal volunteer={volunteer} onClose={() => setShowEdit(false)} onSave={profileUpdate} />}
    </div>
  );
};

export default Overview;