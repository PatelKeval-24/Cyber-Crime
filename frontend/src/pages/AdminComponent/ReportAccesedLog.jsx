import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

// ── helpers ───────────────────────────────────────────────────────────────────
const priorityBadge = {
  High:   "bg-red-500/15 text-red-400 border border-red-500/30",
  Medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Low:    "bg-green-500/15 text-green-400 border border-green-500/30",
  high:   "bg-red-500/15 text-red-400 border border-red-500/30",
  medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  low:    "bg-green-500/15 text-green-400 border border-green-500/30",
};

const statusBadge = {
  "Under Investigation": "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  "approved":            "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  "Open":                "bg-sky-500/15 text-sky-400 border border-sky-500/30",
  "Closed":              "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

const fmt = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-white/6 pb-2 gap-3">
    <span className="text-slate-500 text-xs font-mono flex-shrink-0">{label}</span>
    <span className="text-slate-300 text-sm text-right">{value || "—"}</span>
  </div>
);

function ReportAccessedLog() {
  const [report, setReport]   = useState([]);
  const [view, setView]       = useState(null);
  const [criminal, setCriminal] = useState([]);
  const token = useContext(AuthContext);

  useEffect(() => {
    const getReport = async () => {
      const pendingReport = await axios.get(
        "http://localhost:3000/home/admin-dashboard/submited",
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json", Authorization: token.token },
        }
      );
      // console.log(pendingReport.data.reports, "pending report");
      // const arr = pendingReport.data.reports[0].InvestigationReport.nameOfInvestigator;
      // console.log(arr, "pending report");
      setReport(pendingReport.data.reports);
    };
    getReport();
  }, []);

  const againInvestigate = async (r) => {
    const id = r._id;
    const report = await axios.get(
      `http://localhost:3000/home/admin-dashboard/againInvestigate/${r._id}`,
      { id }, { withCredentials: true },
      { headers: { "Content-Type": "application/json", Authorization: token.token } }
    );
    console.log(report);
    if (report.data.status === "succes") {
      setReport((prev) => prev.filter((report) => report._id !== r._id));
      alert(report.data.message);
    } else { alert(report.data.message); }
  };

  // const reportRejected = async (r) => {
  //   const id = r._id;
  //   const report = await axios.patch(
  //     "http://localhost:3000/home/admin-dashboard/repot-rejected",
  //     { id }, { withCredentials: true },
  //     { headers: { "Content-Type": "application/json", Authorization: token.token } }
  //   );
  //   console.log(report);
  //   if (report.data.status === "succes") {
  //     setReport((prev) => prev.filter((report) => report._id !== r._id));
  //     alert(report.data.message);
  //   } else { alert(report.data.message); }
  // };

  const text = "text-white";

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">

      {/* ── header ── */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-orange-400 mb-2">// Admin Panel</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          Investigation{" "}
          <span className="text-transparent bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text">
            Reports
          </span>
          <span className="text-base font-normal text-slate-600 ml-3">({report.length} submitted)</span>
        </h1>
        <div className="h-0.5 w-12 mt-3 rounded-full bg-gradient-to-r from-orange-500 to-transparent" />
      </div>

      {/* ── cards grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {report.map((r) => (
          <div key={r._id}
            className="bg-slate-900/90 border border-white/7 rounded-2xl flex flex-col hover:-translate-y-1 hover:border-white/15 hover:shadow-xl hover:shadow-black/50 transition-all duration-200 overflow-hidden">

            {/* top strip */}
            <div className="h-[3px] w-full bg-gradient-to-r from-orange-400 to-transparent" />

            <div className="p-4 flex flex-col gap-3 flex-1">

              {/* victim name + status */}
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="text-slate-100 font-bold text-[15px] truncate">{r.report.name}</h3>
                  <p className="text-slate-500 text-[11px] font-mono truncate mt-0.5">{r.report.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusBadge[r.report.status] || "bg-slate-500/15 text-slate-400 border border-slate-500/30"}`}>
                    {r.status}
                  </span>
                  <span className="text-slate-600 text-[10px] font-mono">{fmt(r.report.date)}</span>
                </div>
              </div>

              {/* crime type + category + priority */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  {r.report.crimeType}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/25">
                  {r.report.crimeCategory}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${priorityBadge[r.report.priority] || priorityBadge.Low}`}>
                  ⚡ {r.report.priority}
                </span>
              </div>

              {/* investigators */}
              <div className="bg-white/3 border border-white/6 rounded-xl px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-2">🔍 Investigators</p>
                <div className="flex flex-col gap-1">
                  {r.InvestigationReport?.nameOfInvestigator?.length > 0
                    ? r.InvestigationReport.nameOfInvestigator.map((inv, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-slate-300 text-xs font-medium">{inv.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            {inv.role}
                          </span>
                        </div>
                      ))
                    : <span className="text-slate-600 text-xs italic">No investigators assigned</span>
                  }
                </div>
              </div>

              {/* summary preview */}
              {r.InvestigationReport?.summary && (
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                  {r.InvestigationReport.summary}
                </p>
              )}

              {/* submitted by + date */}
              <div className="flex justify-between border-t border-white/5 pt-2">
                <span className="text-slate-600 text-[11px] font-mono">by {r.finalSubmitedBy}</span>
                <span className="text-slate-600 text-[11px] font-mono">{fmt(r.submittedAt)}</span>
              </div>
            </div>

            {/* card footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-t border-white/5">
              <button onClick={() => setView(r)}
                className="px-4 py-1.5 rounded-xl text-sm font-medium text-sky-300 bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500/25 transition-all cursor-pointer">
                View
              </button>
              <div className="flex gap-2">
                {/* <button onClick={() => reportRejected(r)}
                  className="px-4 py-1.5 rounded-xl text-sm font-medium text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 transition-all cursor-pointer">
                  Reject
                </button> */}
                <button onClick={() => againInvestigate(r)}
                  className="px-4 py-1.5 rounded-xl text-sm font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer">
                  Need More Investigation 
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ DETAIL MODAL ══════════════════════════════════════════════════════ */}
      {view && (
        <div onClick={() => setView(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div onClick={(e) => e.stopPropagation()}
            className="w-[min(1000px,96vw)] max-h-[92vh] overflow-y-auto bg-slate-950 border border-white/10 rounded-2xl flex flex-col shadow-2xl shadow-black/70">

            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/7 sticky top-0 bg-slate-950 z-10">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-orange-400 mb-1">Investigation Report ({view.report._id})</p>
                <h2 className="text-slate-100 text-xl font-bold">{view.report.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge[view.report.status] || "bg-slate-500/15 text-slate-400 border border-slate-500/30"}`}>
                  {view.report.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityBadge[view.report.priority] || priorityBadge.Low}`}>
                  ⚡ {view.report.priority}
                </span>
                <button onClick={() => setView(null)}
                  className="ml-1 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-sm transition-all cursor-pointer">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6">

              {/* ── row 1: victim + crime ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-indigo-400 font-semibold text-sm mb-3">👤 Victim Information</p>
                  <div className="bg-white/3 border border-white/7 rounded-xl p-4 flex flex-col gap-3">
                    <InfoRow label="Name"     value={view.report.name} />
                    <InfoRow label="Age"      value={view.report.age} />
                    <InfoRow label="Gender"   value={view.report.gender} />
                    <InfoRow label="Contact"  value={view.report.contact} />
                    <InfoRow label="Email"    value={view.report.email} />
                    <InfoRow label="Address"  value={view.report.victimAddress} />
                  </div>
                </div>
                <div>
                  <p className="text-indigo-400 font-semibold text-sm mb-3">🔍 Crime Information</p>
                  <div className="bg-white/3 border border-white/7 rounded-xl p-4 flex flex-col gap-3">
                    <InfoRow label="Crime Type"    value={view.report.crimeType} />
                    <InfoRow label="Category"      value={view.report.crimeCategory} />
                    <InfoRow label="Priority"      value={view.report.priority} />
                    <InfoRow label="Location"      value={view.report.location} />
                    <InfoRow label="Crime Date"    value={fmt(view.report.date)} />
                    <InfoRow label="Submitted By"  value={view.report.submitedBy} />
                    {/* <InfoRow label="Report Status" value={view.report.reportStatus} /> */}
                  </div>
                </div>
              </div>

              {/* ── victim description ── */}
              <div>
                <p className="text-indigo-400 font-semibold text-sm mb-2">📋 Case Description</p>
                <div className="bg-white/3 border border-white/7 rounded-xl p-4">
                  <p className="text-slate-400 text-sm leading-relaxed">{view.report.description}</p>
                </div>
              </div>

              {/* ── investigators ── */}
              <div>
                <p className="text-violet-400 font-semibold text-sm mb-3">🧑‍💼 Investigators</p>
                <div className="grid grid-cols-2 gap-3">
                  {view.InvestigationReport?.nameOfInvestigator?.length > 0
                    ? view.InvestigationReport.nameOfInvestigator.map((inv, i) => (
                        <div key={i} className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-100 font-semibold text-sm">{inv.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/25">
                              {inv.role}
                            </span>
                          </div>
                          <span className="text-slate-500 text-xs font-mono">{inv.email}</span>
                          <span className="text-slate-600 text-[11px]">Joined: {fmt(inv.investigationjoinDate)}</span>
                        </div>
                      ))
                    : <div className="bg-white/3 border border-white/7 rounded-xl p-4 text-slate-500 text-sm italic col-span-2">
                        No investigators assigned yet.
                      </div>
                  }
                </div>
              </div>

              {/* ── investigation summary ── */}
              {view.InvestigationReport?.summary && (
                <div>
                  <p className="text-orange-400 font-semibold text-sm mb-2">📝 Investigation Summary</p>
                  <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-4">
                    <p className="text-slate-300 text-sm leading-relaxed">{view.InvestigationReport.summary}</p>
                  </div>
                </div>
              )}

              {/* ── criminal info ── */}
              <div>
                <p className="text-red-400 font-semibold text-sm mb-3">🚨 Criminal Information</p>
                {view.InvestigationReport?.criminalInfo?.length > 0
                  ? <div className="grid grid-cols-2 gap-3">
                      {view.InvestigationReport.criminalInfo.map((c, i) => (
                        <div key={i} className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-100 font-bold text-sm">{c.cname}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                              Suspect #{i + 1}
                            </span>
                          </div>
                          <InfoRow label="Age"               value={c.cage} />
                          <InfoRow label="Gender"            value={c.gender} />
                          <InfoRow label="Address"           value={c.caddress} />
                          <InfoRow label="Primary Contact"   value={c.ccontact} />
                          <InfoRow label="Secondary Contact" value={c.ccontact2 || "—"} />
                        </div>
                      ))}
                    </div>
                  : <div className="bg-white/3 border border-white/7 rounded-xl p-4 text-slate-500 text-sm italic">
                      No criminal information recorded for this investigation.
                    </div>
                }
              </div>

              {/* ── evidence ── */}
              <div>
                <p className="text-sky-400 font-semibold text-sm mb-3">📎 Evidence Files</p>
                {view.InvestigationReport?.evidence?.length > 0
                  ? <div className="flex flex-col gap-2">
                      {view.InvestigationReport.evidence.map((ev, i) => (
                        <div key={i} className="bg-sky-500/5 border border-sky-500/15 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-sky-400 text-lg flex-shrink-0">📄</span>
                            <div className="min-w-0">
                              <p className="text-slate-200 text-sm font-medium truncate">{ev.originalName}</p>
                              <p className="text-slate-600 text-[11px] font-mono">{fmt(ev.uploadedAt)}</p>
                            </div>
                          </div>
                          <a href={ev.url} target="_blank" rel="noopener noreferrer"
                            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-300 bg-sky-500/15 border border-sky-500/25 hover:bg-sky-500/25 transition-all">
                            View File ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  : <div className="bg-white/3 border border-white/7 rounded-xl p-4 text-slate-500 text-sm italic">
                      No evidence files uploaded.
                    </div>
                }
              </div>

              {/* ── final submission info ── */}
              <div className="bg-white/3 border border-white/7 rounded-xl p-4 flex flex-col gap-2">
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-1">Final Submission</p>
                <InfoRow label="Submitted By"  value={view.finalSubmitedBy} />
                <InfoRow label="Email"         value={view.finalSubmitedEmail} />
                <InfoRow label="Submitted At"  value={fmt(view.submittedAt?.$date || view.submittedAt)} />
              </div>

            </div>

            {/* modal footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/7 bg-black/20 rounded-b-2xl sticky bottom-0">
              {/* <button className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 transition-all cursor-pointer">
                Reject
              </button> */}
              <button className="px-4 py-2 rounded-xl text-sm font-semibold text-yellow-300 bg-yellow-500/15 border border-yellow-500/30 hover:bg-yellow-500/25 transition-all cursor-pointer">
                Need More Investigation
              </button>
              <button onClick={() => setView(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                પાછળ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportAccessedLog;