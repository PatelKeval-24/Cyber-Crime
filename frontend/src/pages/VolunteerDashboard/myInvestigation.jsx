import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
// axios.defaults.withCredentials = true;

function MyInvestigation() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState("");
  const navigate = useNavigate();
  
  // submit report handeller
  const handleSubmit = async () =>{
    
  try {
    const formData = new FormData();
    formData.append("reportId", view._id);

    const res = await axios.get(
      `http://localhost:3000/home/volunteer-dashboard/myinvestigation/submit/${view._id}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
      
    alert("Submitted successfully");
  } catch (err) {
    console.error(err);
    alert("Error submitting report");
  }
  }

  // saving 
  const handleSaveReport = async () => {
  try {
    const formData = new FormData();
    formData.append("reportId", view._id);
    formData.append("summary", summary);
    
    // 1. Ensure this matches the backend 'criminals' key
    formData.append("criminals", JSON.stringify(criminals));

    const existingEvidence = [];
  selectedFiles.forEach((file) => {
    if (file instanceof File) {
      // THIS MUST BE "files" because your middleware addEvidance expects "files"
      formData.append("files", file); 
    } else {
      existingEvidence.push(file);
    }
  });
  formData.append("existingEvidence", JSON.stringify(existingEvidence));

    const res = await axios.post(
      "http://localhost:3000/home/volunteer-dashboard/myinvestigation/saved",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    alert("Saved successfully");
  } catch (err) {
    console.error(err);
    alert("Error saving report");
  }
};


  

  /// location API
  // useEffect(() => {
  //   axios.get('http://localhost:3000/api/user-info',{ withCredentials: true},)
  //     .then(res => res.json())
  //     .then(data => {
  //       setUserData(data);
  //       setLoading(false);
  //     })
  //     .catch(err => {
  //       console.error("Error fetching IP info:", err);
  //       setLoading(false);
  //     });
  // }, []);

  // if (loading) return <p>Loading network info...</p>;

  ////////////////////////////////////////////

  const [view, setView] = useState(null);
  const token = useContext(AuthContext);

  useEffect(() => {
    console.log(token);
    const getReport = async () => {
      const myReport = await axios.get(
        "http://localhost:3000/home/volunteer-dashboard/myinvestigation",
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(myReport.data.report, "pending report");
      // setReport();
      setReport(myReport.data.report);
    };
    getReport();
  }, []);

  useEffect(() => {
  const fetchSavedData = async () => {
    if (!view) return; // Only run if the modal is open

    try {
      // 1. Call the API for the "Saved" collection (Collection B)
      const res = await axios.get(
        `http://localhost:3000/home/volunteer-dashboard/myinvestigation/saved/${view._id}`,
        { withCredentials: true }
      );

      // 2. If data exists in Collection B, fill the form with it
      if (res.data && res.data.criminalInfo) {
        setSummary(res.data.summary || "");

        // --- THE FIX: Flatten the double array ---
        // .flat() converts [[{...}], [{...}]] into [{...}, {...}]
        const flattenedCriminals = res.data.criminalInfo.flat();
        setCriminals(flattenedCriminals);
      }else {
        // 3. If no saved data exists yet, start with a clean slate
        setSummary("");
        setCriminals([]);
      }
      if (res.data.evidence) {
          // We set this to the files state so they show up in your list
          const savedFiles = res.data.evidence.flat();
          setSelectedFiles(savedFiles);
        }
      console.log(res,'gettin saved data');
      
    } catch (err) {
      console.log("No previous saved data found for this report.");
      setSummary("");
      setCriminals([]);
    }
  };

  fetchSavedData();
}, [view]); // Runs every time you click "Edit" and 'view' changes

  // const reportApproved = async (r) =>{
  //  const id = r._id
  //  const report = await axios.patch("http://localhost:3000/home/admin-dashboard/repor-approved",{id,token},{ withCredentials: true},{
  //   headers :{
  //     "Content-Type":"application/json",
  //     Authorization :token.token
  //   }
  //  })
  //  console.log(report);
  // //  console.log(report.data.status);

  //  if(report.data.status === "succes" ){
  //   setReport((prev) => prev.filter((report) => report._id !== r._id))
  //   alert(report.data.message);
  //  }else{
  //   alert(report.data.message)
  //  }

  // }

  //////////////// same of the function
  // --- State for Files (Keeping your original state) ---
  const [selectedFiles, setSelectedFiles] = useState([]);

  // --- State for Criminals (Updated to your new schema) ---
  const [criminals, setCriminals] = useState([]);
  const [tempCriminal, setTempCriminal] = useState({
  cname: '', gender: '', cage: '', caddress: '', ccontact: '', ccontact2: ''
});


  // ── File Handlers (Left untouched as requested) ──────────────────
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Criminal Handlers (Updated with your new logic) ───────────────
  const handleInputChange = (e) => {
    setTempCriminal({ ...tempCriminal, [e.target.name]: e.target.value });
  };

  const addCriminal = () => {
    if (!tempCriminal.cname) return; // Don't add if name is empty
    setCriminals([...criminals, tempCriminal]);
    // Reset the form inputs using your new keys
    setTempCriminal({ 
      cname: '', gender: '', cage: '', caddress: '', ccontact: '' 
    });
  };

  const removeCriminal = (index) => {
    setCriminals(criminals.filter((_, i) => i !== index));
  };
  
  console.log(tempCriminal,'form data');
  
  const text = "text-white";
  return (
    <>
      {/* DROP-IN REPLACEMENT — pure Tailwind only, no <style> tag, no inline styles, logic untouched, gender added below name */}

      <>
        <div className="min-h-screen bg-gray-950 px-8 py-11 relative overflow-hidden">
          {/* ── ambient orbs ── */}
          <div className="absolute w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl -top-24 -left-24 pointer-events-none" />
          <div className="absolute w-80 h-80 rounded-full bg-violet-500/5 blur-3xl -bottom-16 right-0 pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full bg-sky-400/5 blur-3xl top-1/2 right-1/4 pointer-events-none" />

          {/* ── header ── */}
          <div className="relative z-10 mb-9">
            <p className="text-xs font-mono tracking-widest uppercase text-yellow-400 mb-1">
              Admin Dashboard
            </p>
            <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight leading-none">
              Under Investigation
              <span className="ml-3 text-transparent bg-linear-to-r from-yellow-400 to-violet-400 bg-clip-text">
                ({report.length})
              </span>
            </h1>
            <div className="mt-3 h-0.5 w-14 bg-linear-to-r from-yellow-400 to-transparent rounded-full" />
          </div>

          {/* ── grid ── */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {report.map((r) => (
              <div
                key={r._id}
                className="bg-gray-900/80 border border-yellow-400/15 rounded-2xl backdrop-blur-sm flex flex-col hover:-translate-y-1 hover:border-yellow-400/30 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 overflow-hidden"
              >
                {/* top accent bar */}
                <div className="h-1  bg-linear-to-r from-yellow-400 to-violet-400 rounded-t-2xl " />

                {/* card header */}
                <div className="px-5 pt-4 pb-3 border-b border-white/5 bg-white/2">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h2 className="text-slate-200 font-bold text-sm truncate">
                        {r.name}
                      </h2>
                      {/* gender below name */}
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-600">
                        {r.gender || "—"}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {r.email}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-600 shrink-0 mt-0.5">
                      {new Date(r.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* card body */}
                <div className="px-5 py-4 flex-1">
                  {/* type + category pills */}
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                      {r.crimeType}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/25 text-fuchsia-300">
                      {r.crimeCategory}
                    </span>
                  </div>

                  {/* priority + submitted by */}
                  <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-yellow-400/10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(251,191,36,0.6)] inline-block" />
                      <span className="text-xs font-mono text-yellow-400">
                        {r.priority}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-600">
                      by {r.submitedBy}
                    </span>
                  </div>

                  {/* description */}
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {r.description}
                  </p>
                </div>

                {/* card footer */}
                <div className="px-4 py-3 mt-auto border-t border-white/5 bg-white/2 rounded-b-2xl flex justify-between items-center">
                  <button
                    onClick={() => setView(r)}
                    className="text-sky-300 text-xs font-semibold px-4 py-1.5 rounded-lg border border-sky-400/40 bg-sky-400/10 hover:bg-sky-400/20 hover:border-sky-400/70 transition-all duration-200 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button className="text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-400/40 bg-rose-400/10 hover:bg-rose-400/20 hover:border-rose-400/70 transition-all duration-200 cursor-pointer">
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ MODAL ══════════════ */}
        {view && (
          <div
            onClick={() => setView(null)}
            className="fixed inset-0 z-50 flex items-start justify-center  overflow-y-auto p-5 bg-gray-950/90 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl mt-10  bg-gray-900 overflow-hidden border border-white/10 rounded-2xl flex flex-col"
            >
              {/* accent bar */}
              <div className="h-1 bg-linear-to-r from-yellow-400 via-violet-400 to-sky-400 rounded-t-2xl shrink-0" />

              {/* modal header */}
              <div className="px-7 pt-6 pb-4 border-b border-white/5"><div className="flex justify-between">
                <div>
                <p className="text-xs font-mono tracking-widest uppercase text-yellow-400 mb-1">
                  Investigation Report
                </p>
                <h2 className="text-xl font-extrabold text-slate-50 tracking-tight">
                  Report Details
                </h2>
                </div>
                <div>
                <h1 className="bg-linear-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">Id:{view._id}</h1>
                </div>
                </div>
                <div className="mt-3 h-px bg-linear-to-r from-yellow-400/40 to-transparent" />
              </div>

              <div className="px-7 pt-5 pb-2 flex flex-col gap-5">
                {/* two-column info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* victim info */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-400/10 border border-sky-400/20 rounded-md px-2.5 py-1 mb-3">
                      👤 Victim Information
                    </span>
                    <div className="bg-white/2 border border-white/6 rounded-xl px-4 py-1">
                      {[
                        ["Name", view.name],
                        ["Gender", view.gender],
                        ["Age", view.age],
                        ["Contact", view.contact],
                        ["Email", view.email],
                        ["Address", view.victimAddress],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0"
                        >
                          <span className="text-xs font-mono uppercase tracking-wider text-slate-600">
                            {label}
                          </span>
                          <span className="text-xs text-slate-300 text-right max-w-[55%] truncate">
                            {value || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* crime info */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-md px-2.5 py-1 mb-3">
                      🔍 Crime Information
                    </span>
                    <div className="bg-white/2 border border-white/6 rounded-xl px-4 py-1">
                      {[
                        ["Crime Type", view.crimeType],
                        ["Category", view.crimeCategory],
                        ["Priority", view.priority],
                        ["Location", view.location],
                        ["Date", view.crimeDate],
                        ["Submitted By", view.submitedBy],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0"
                        >
                          <span className="text-xs font-mono uppercase tracking-wider text-slate-600">
                            {label}
                          </span>
                          <span className="text-xs text-slate-300 text-right max-w-[55%] truncate">
                            {value || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* description */}
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-md px-2.5 py-1 mb-3">
                    📝 Detailed Description
                  </span>
                  <div className="bg-white/2 border border-white/6 rounded-xl p-4">
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {view.description}
                    </p>
                  </div>
                </div>

                {/* form */}
                <form className="flex flex-col gap-5 pb-2">
                  {/* summary */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-md px-2.5 py-1 mb-3">
                      📋 Investigation Summary
                    </span>
                    <label className="block text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5">
                      Summary
                    </label>
                    <textarea
                    value={summary}
  onChange={(e) => setSummary(e.target.value)}
                      className="w-full min-h-20 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-xs placeholder-slate-700 outline-none focus:border-yellow-400/40 transition-colors resize-y"
                      placeholder="Write investigation summary…"
                    />
                  </div>

                  {/* evidence */}
                  {/* 2. Multiple File Upload Section */}
                  <div>
  <label className="block text-xs font-mono uppercase tracking-widest text-slate-600 mb-2">
    Evidence / Proof (PDFs)
  </label>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
    {/* Upload Button */}
    <label className="flex items-center justify-center gap-2 px-4 py-6 bg-white/3 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-yellow-400/40 hover:bg-white/5 transition-all">
      <span className="text-xl">➕</span>
      <span className="text-xs font-mono text-slate-400">
        Click to add files
      </span>
      <input
        type="file"
        multiple
        accept="*/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>

    {/* List of Uploaded Files */}
    <div className="flex flex-col gap-2">
      {selectedFiles.map((file, idx) => (
        <div 
          key={idx}
          className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-lg"
        >
          <span onClick={() =>window.open(file.url, "_blank", "noopener,noreferrer")} className="text-[10px] font-mono text-slate-300 truncate w-40">
            {/* Logic: use .name for new uploads, .originalname for database data */}
            📎 { file.originalName || "Unknown File"}
          </span>
          <button
            type="button"
            onClick={() => removeFile(idx)}
            className="text-rose-400 text-xs hover:scale-110"
          >
            ✕
          </button>
        </div>
      ))}
      
      {selectedFiles.length === 0 && (
        <p className="text-[10px] text-slate-700 font-mono italic">
          No files selected
        </p>
      )}
    </div>
  </div>
</div>

                  {/* criminal info */}
                  {/* criminal info */}
<div>
  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-md px-2.5 py-1 mb-3">
    🚨 Criminal Information
  </span>
  
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5">Name</label>
      <input
        type="text"
        name="cname"
        value={tempCriminal.cname}
        onChange={handleInputChange}
        placeholder="Criminal Name"
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-xs placeholder-slate-700 outline-none focus:border-yellow-400/40 transition-colors"
      />
    </div>

    <div>
      <h1 className="ml-3 text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5">Gender</h1>
      <input type="radio" id="male" name="gender" value="male" checked={tempCriminal.gender === 'male'} onChange={handleInputChange} required />
      <label className="ml-3 text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5" htmlFor="male">Male</label>

      <input type="radio" id="female" name="gender" value="female" checked={tempCriminal.gender === 'female'} onChange={handleInputChange} required className='ml-2'/>
      <label className="ml-3 text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5" htmlFor="female">Female</label>

      <input type="radio" id="other" name="gender" value="other" checked={tempCriminal.gender === 'other'} onChange={handleInputChange} required className='ml-2'/>
      <label className="ml-3 text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5" htmlFor="other">Other</label>
    </div>

    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5">Age</label>
      <input
        type="number"
        name="cage"
        value={tempCriminal.cage}
        onChange={handleInputChange}
        placeholder="Criminal Age"
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-xs placeholder-slate-700 outline-none focus:border-yellow-400/40 transition-colors"
      />
    </div>

    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5">Address</label>
      <input
        type="text"
        name="caddress"
        value={tempCriminal.caddress}
        onChange={handleInputChange}
        placeholder="Criminal Address"
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-xs placeholder-slate-700 outline-none focus:border-yellow-400/40 transition-colors"
      />
    </div>

    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5">Contact</label>
      <input
        type="number"
        name="ccontact"
        value={tempCriminal.ccontact}
        onChange={handleInputChange}
        placeholder="Criminal Contact"
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-xs placeholder-slate-700 outline-none focus:border-yellow-400/40 transition-colors"
      />
    </div>
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5">Contact</label>
      <input
        type="number"
        name="ccontact2"
        value={tempCriminal.ccontact2 || ""}
        onChange={handleInputChange}
        placeholder="Criminal Contact"
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-xs placeholder-slate-700 outline-none focus:border-yellow-400/40 transition-colors"
      />
    </div>

    <button 
      type="button" 
      onClick={addCriminal}
      className="col-span-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 py-2 rounded-lg text-xs font-mono uppercase tracking-widest hover:bg-rose-500/30 transition-all"
    >
      + Add to Case Records
    </button>
  </div>

  {/* Display the list of added criminals below the inputs */}
  <div className="mt-4 flex flex-col gap-2">
    {criminals.map((item, index) => (
      <div key={index} className="flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg animate-in fade-in slide-in-from-left-1">
        <div className="flex gap-3 text-[10px] font-mono uppercase tracking-tight">
          <span className="text-rose-400 font-bold">#{index + 1}</span>
          <span className="text-slate-200">{item.cname}</span>
          <span className="text-slate-500">| {item.gender}</span>
          <span className="text-slate-500">| {item.cage} yrs</span>
        </div>
        <button 
          type="button" 
          onClick={() => removeCriminal(index)} 
          className="text-rose-400 hover:text-rose-200 transition-colors px-2"
        >
          ✕
        </button>
      </div>
    ))}

                    </div>
                  </div>
                </form>
              </div>

              {/* modal footer */}
              <div className="px-6 py-3.5 mt-auto flex justify-between gap-2.5 bg-black/30 border-t border-white/6 rounded-b-2xl shrink-0">
                <div>
                  <button 
                  onClick={handleSaveReport} className="text-sky-300 text-xs font-semibold px-4 py-1.5 rounded-lg border border-sky-400/40 bg-sky-400/10 hover:bg-sky-400/20 hover:border-sky-400/70 transition-all duration-200 cursor-pointer">
                    Save the information
                  </button>
                </div>
                <div className="flex gap-2.5">
                  <button className="text-rose-300 text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-rose-400/40 bg-rose-400/10 hover:bg-rose-400/20 hover:border-rose-400/70 transition-all duration-200 cursor-pointer">
                    Leave
                  </button>
                  <button onClick={handleSubmit} className="text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-emerald-400/40 bg-emerald-400/10 hover:bg-emerald-400/20 hover:border-emerald-400/70 transition-all duration-200 cursor-pointer">
                    Submit
                  </button>
                  <button
                    onClick={() => setView(null)}
                    className="text-slate-400 text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-600/25 bg-slate-600/5 hover:bg-slate-600/15 hover:text-slate-200 transition-all duration-200 cursor-pointer"
                  >
                    પાછળ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}

export default MyInvestigation;

// import React from 'react'
// import axios from "axios"

// function MyInvestigation() {

//   const getUserData = async () =>{
//     alert("button clicked")
//     const deviceInfo = {
//   browser: navigator.userAgent,
//   platform: navigator.platform,
//   screen: `${window.screen.width}x${window.screen.height}`
// };
//     const hellow = "hello"
//     await axios.post("http://localhost:3000/userInfo",{deviceInfo},{
//     headers :{
//       "Content-Type":"application/json",

//     }
//    })

//   }
//   return (
//     <>
//     <h1>My investication </h1>
//      <div className="w-6/7 m-10 flex flex-col bg-neutral-900 border-2 border-indigo-400/30 rounded-2xl shadow-lg hover:shadow-2xl shadow-indigo-500 hover:scale-[1.01] transition duration-300">

//   {/* Header */}
//   <div className="p-3 bg-gray-700/30 flex justify-between rounded-t-2xl border-b border-gray-600">

//     <div>
//       <h1 className="text-white text-xl">Jems Bond</h1>
//       <span className="text-xs text-gray-300">jems@gmail.com</span>
//     </div>

//     <div className="flex flex-col items-end">
//       <span className="text-xs px-3 py-1 rounded-2xl bg-yellow-500/20 text-yellow-300 border border-yellow-400">
//         Under Investigation
//       </span>

//       <span className="text-xs text-gray-400 mt-2">
//         28 Feb 2026
//       </span>
//     </div>
//   </div>

//   {/* Crime Info */}
//   <div className="p-3">
//     <div className="flex gap-2 mb-2">
//       <span className="text-xs bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded-2xl">
//         Phishing Attack
//       </span>
//       <span className="text-xs bg-fuchsia-500/20 text-fuchsia-200 px-2 py-1 rounded-2xl">
//         Cyber Crime
//       </span>
//     </div>

//     <div className="flex justify-between border-b border-gray-600 pb-2">
//       <span className="text-white text-xs">
//         Priority : Moderate
//       </span>
//       <span className="text-white text-xs">
//         Location : Vansda
//       </span>
//     </div>
//   </div>

//   {/* Description */}
//   <div className="p-3">
//     <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
//       Victim received a fake bank email asking for account verification.
//       After submitting credentials, unauthorized transactions were made.
//     </p>
//   </div>

//   {/* Investigation Details */}
//   <div className="px-3 pb-3">
//     <h1 className="text-indigo-300 text-sm mb-1">Assigned Investigator:</h1>
//     <div className="bg-neutral-800/60 rounded-xl p-2 text-xs text-gray-300">
//       Rushil (Lead Investigator)
//     </div>
//   </div>

//   {/* Bottom Buttons */}
//   <div className="p-2 mt-auto flex justify-between bg-gray-700/30 rounded-b-2xl border-t border-gray-600">

//     <button className="px-4 py-1 text-white text-sm border border-sky-400 bg-sky-900/60 rounded-2xl">
//       View
//     </button>

//     <button onClick={() =>{getUserData()}} className="px-4 py-1 text-white text-sm border border-green-400 bg-green-400/20 rounded-2xl">
//       Update
//     </button>

//   </div>
// </div>
//     </>
//   )
// }

// export default MyInvestigation
