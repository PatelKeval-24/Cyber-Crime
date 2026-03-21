import react, { useContext } from "react"
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const navLinks = [
  { to: "",                  label: "Dashboard",        icon: "⊞" },
  { to: "all-reports",       label: "All Reports",      icon: "📋" },
  { to: "my-investigation",  label: "My Investigation", icon: "🔍" },
  { to: "Dishable-Account",  label: "Disable Account",  icon: "🚫" },
];

const VolunteerDashboard = () => {
  const { name } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="flex bg-slate-950 min-h-screen pt-[53px]">

      {/* ── sidebar ── */}
      <aside className="fixed top-[53px] left-0 w-60 h-[calc(100vh-53px)] bg-[#070b12] border-r border-white/6 flex flex-col z-30">

        {/* user badge */}
        <div className="px-4 py-4 border-b border-white/6">
          <div className="flex items-center gap-3 bg-violet-500/8 border border-violet-500/15 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {name?.[0]?.toUpperCase() || "V"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{name}</p>
              <p className="text-violet-400 text-[10px] font-mono tracking-wider">Volunteer</p>
            </div>
          </div>
        </div>

        {/* nav links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-slate-700 px-2 mb-2">Menu</p>
          {navLinks.map(({ to, label, icon }) => {
            const segment = location.pathname.split("/").pop();
            const isActive = to === ""
              ? segment === "volunteer-dashboard" || location.pathname.endsWith("volunteer-dashboard")
              : segment === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/4 border border-transparent"
                  }`}
              >
                <span className="text-sm leading-none w-5 text-center">{icon}</span>
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </Link>
            );
          })}
        </nav>

        {/* footer */}
        <div className="px-4 py-3 border-t border-white/6">
          <p className="font-mono text-[10px] text-slate-700 text-center tracking-widest uppercase">Volunteer Panel</p>
        </div>
      </aside>

      {/* ── main ── */}
      <main className="ml-60 flex-1 min-h-[calc(100vh-53px)] bg-slate-950 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default VolunteerDashboard;