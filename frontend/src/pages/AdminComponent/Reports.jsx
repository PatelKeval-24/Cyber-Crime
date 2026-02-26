import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [report, setReport] = useState([]);
  // const [view, setView] = useState(false);

  useEffect(() => {
    const getReport = async () => {
      const pendingReport = await axios.get(
        "https://cyber-crime-desk.onrender.com/home/admin-dashboard/report",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // console.log(pendingReport.data.pendingReport, "pending report");
      setReport(pendingReport.data.pendingReport);
    };
    getReport();
  }, []);

  const viewData = (r) => {
    // setView();
    // return r;
  }
  const text = "text-white";
  return (
    <>
    {/* {view === false ? ( */}
      {/* <> */}
      <h1 className="text-white font-bold text-3xl text-center">
        Reports that are sumbited
      </h1>
      <div className="grid grid-cols-3">
        {report.map((r) => (
          <div className="w-6/7 m-10 flex flex-col justify bg-neutral-900 border-2 border-yellow-300/40 rounded-2xl shadow-lg hover:shadow-2xl shadow-indigo-500 hover:scale-[1.01] transition duration-300">
            <div className=" p-3 bg-gray-600/30 flex justify-between text-center rounded-t-2xl border-b-2 border-gray-500">
              <div className="flex flex-col justify-baseline ">
                <h1 className="text-white text-xl ">{r.name} </h1>
                <span className="text-xs text-white ">{r.email}</span>
              </div>
              <h1 className="text-white">
                {" "}
                {new Date(r.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
              </h1>
            </div>

            <div className="p-3">
              <div className="flex justify-baseline mb-2">
                <span className="text-xs text-white bg-indigo-700/20 border rounded-2xl pl-1 pr-1">
                  {r.crimeType}
                </span>
                <span className="text-xs text-fuchsia-100   ml-3 bg-fuchsia-500/20 border rounded-2xl pl-1 pr-1">
                  {r.crimeCategory}
                </span>
              </div>
              <h1 className="flex justify-between border-b border-amber-200">
                <span className="text-white text-xs mt-2">
                  Priority : {r.priority}
                </span>
                <span className="text-white text-xs mt-2">
                  Submited By : {r.submitedBy}
                </span>
              </h1>
            </div>
            <div className="p-3">
              <h1 className="text-white text-xs leading-relaxed line-clamp-3">
                {r.description}
              </h1>
            </div>
            <div>
              <h1 className="text-white"> {r.submitedBy}</h1>
            </div>
            {/* bottum part  */}
            <div className="p-2 mt-auto flex justify-between bg-gray-600/30 rounded-b-2xl border-t-2 border-gray-500 ">
              <button
                onClick={viewData(r)}
                className="pr-4 pl-4 text-white text-sm border-2 border-sky-400 bg-sky-900/60 rounded-2xl  w-"
              >
                {" "}
                View{" "}
              </button>
              <div className="">
                <button className=" mr-3 pr-2 pl-2 text-white text-sm border-2 border-rose-400 bg-rose-400/40 rounded-2xl  w-">
                  Reject
                </button>
                <button className="mr-2 pr-2 pl-2 text-white text-sm border-2 border-green-400 bg-green-400/20 rounded-2xl  w-">
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* </>) : (
        <>
        <h1>Report details</h1>
        </>

      )} */}
    </>
  );
}

export default Reports;
