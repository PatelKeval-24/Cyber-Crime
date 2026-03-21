import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

// ── small helpers ─────────────────────────────────────────────────────────────
const priorityBadge = {
  High:   "bg-red-500/15 text-red-400 border border-red-500/30",
  Medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Low:    "bg-green-500/15 text-green-400 border border-green-500/30",
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-white/6 pb-2 gap-3">
    <span className="text-slate-500 text-xs font-mono flex-shrink-0">{label}</span>
    <span className="text-slate-300 text-sm text-right">{value || "—"}</span>
  </div>
);

function Reports() {
  const [report, setReport] = useState([]);
  const [view, setView] = useState(null);
  const token = useContext(AuthContext);

  useEffect(() => {
    const getReport = async () => {
      const pendingReport = await axios.get(
        "http://localhost:3000/home/admin-dashboard/report",
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token.token,
          },
        }
      );
      console.log(pendingReport.data.pendingReport, "pending report");
      setReport(pendingReport.data.pendingReport);
    };
    getReport();
  }, []);

  const reportApproved = async (r) => {
    const id = r._id;
    const report = await axios.patch(
      "http://localhost:3000/home/admin-dashboard/repot-approved",
      { id },
      { withCredentials: true },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token.token,
        },
      }
    );
    console.log(report);
    if (report.data.status === "succes") {
      setReport((prev) => prev.filter((report) => report._id !== r._id));
      alert(report.data.message);
    } else {
      alert(report.data.message);
    }
  };

  const text = "text-white";

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">

      {/* ── page header ── */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-orange-400 mb-2">
          // Admin Panel
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          Pending{" "}
          <span className="text-transparent bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text">
            Reports
          </span>
          <span className="text-base font-normal text-slate-600 ml-3">
            ({report.length} submitted)
          </span>
        </h1>
        <div className="h-0.5 w-12 mt-3 rounded-full bg-gradient-to-r from-orange-500 to-transparent" />
      </div>

      {/* ── cards grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {report.map((r) => (
          <div
            key={r._id}
            className="bg-slate-900/90 border border-white/7 rounded-2xl flex flex-col hover:-translate-y-1 hover:border-white/15 hover:shadow-xl hover:shadow-black/50 transition-all duration-200 overflow-hidden"
          >
            {/* coloured top strip */}
            <div className="h-[3px] w-full bg-gradient-to-r from-orange-400 to-transparent" />

            <div className="p-4 flex flex-col gap-3 flex-1">
              {/* name + date */}
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="text-slate-100 font-bold text-[15px] truncate">{r.name}</h3>
                  <p className="text-slate-500 text-[11px] font-mono truncate mt-0.5">{r.email}</p>
                </div>
                <span className="text-slate-500 text-[11px] font-mono flex-shrink-0 mt-0.5">
                  {new Date(r.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* tag row */}
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

              {/* priority + submitted by row */}
              <div className="flex justify-between border-b border-white/6 pb-2">
                <span className="text-slate-500 text-xs font-mono">by {r.submitedBy}</span>
              </div>

              {/* description */}
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                {r.description}
              </p>
            </div>

            {/* card footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-t border-white/5">
              <button
                onClick={() => setView(r)}
                className="px-4 py-1.5 rounded-xl text-sm font-medium text-sky-300 bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500/25 transition-all cursor-pointer"
              >
                View
              </button>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-xl text-sm font-medium text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 transition-all cursor-pointer">
                  Reject
                </button>
                <button
                  onClick={() => reportApproved(r)}
                  className="px-4 py-1.5 rounded-xl text-sm font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── detail modal ── */}
      {view && (
        <div
          onClick={() => setView(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(880px,94vw)] max-h-[90vh] overflow-y-auto bg-slate-950 border border-white/10 rounded-2xl flex flex-col shadow-2xl shadow-black/60"
          >
            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/7">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-orange-400 mb-1">
                  Report Details
                </p>
                <h2 className="text-slate-100 text-xl font-bold">{view.name}</h2>
              </div>
              <button
                onClick={() => setView(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-sm transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* two columns */}
            <div className="grid grid-cols-2 gap-4 p-6">
              {/* victim */}
              <div>
                <p className="text-indigo-400 font-semibold text-sm mb-3">
                  👤 Victim Information
                </p>
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
                <p className="text-indigo-400 font-semibold text-sm mb-3">
                  🔍 Crime Information
                </p>
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
              <p className="text-indigo-400 font-semibold text-sm mb-2">
                📋 Detailed Description
              </p>
              <div className="bg-white/3 border border-white/7 rounded-xl p-4">
                <p className="text-slate-400 text-sm leading-relaxed">{view.description}</p>
              </div>
            </div>

            {/* modal footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/7 bg-black/20 rounded-b-2xl">
              <button className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 transition-all cursor-pointer">
                Reject
              </button>
              <button className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer">
                Approve
              </button>
              <button
                onClick={() => setView(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                પાછળ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;