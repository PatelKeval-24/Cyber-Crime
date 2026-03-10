import React, { useEffect, useState } from 'react';
import axios from 'axios';
// axios.defaults.withCredentials = true;

function MyInvestigation() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/user-info',{ withCredentials: true},)
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching IP info:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading network info...</p>;


////////////////////////////////////////////
// const getCompleteDetails = async () => {
//     // A. System & Browser (Client Hints)
//     let uaData = {};
//     if (navigator.userAgentData) {
//         uaData = await navigator.userAgentData.getHighEntropyValues([
//             "architecture", "bitness", "model", "platformVersion", "fullVersionList"
//         ]);
//     }

//     // B. Graphics (WebGL)
//     const canvas = document.createElement('canvas');
//     const gl = canvas.getContext('webgl');
//     const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
//     const gpu = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown GPU";

//     // C. Network
//     const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

//     // D. Battery
//     let battery = {};
//     if (navigator.getBattery) {
//         const b = await navigator.getBattery();
//         battery = { level: b.level * 100 + "%", charging: b.charging };
//     }

//     let data = {
//         system: {
//             os: uaData.platform,
//             osVersion: uaData.platformVersion,
//             arch: uaData.architecture,
//             ram: navigator.deviceMemory + "GB",
//             cores: navigator.hardwareConcurrency
//         },
//         browser: {
//             name: uaData.brands?.[0]?.brand,
//             version: uaData.fullVersionList?.[0]?.version,
//             language: navigator.language
//         },
//         graphics: {
//             gpu: gpu,
//             screen: `${window.screen.width}x${window.screen.height}`,
//             pixelRatio: window.devicePixelRatio
//         },
//         network: {
//             type: conn?.effectiveType,
//             downlink: conn?.downlink + "Mbps",
//             saveData: conn?.saveData
//         },
//         state: battery
//     };
//     console.log('device data', data)
// };
return (
  <>
  <h1 className='text-white'>Device information</h1>
  {/* {getCompleteDetails()} */}
  </>
)
 
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
