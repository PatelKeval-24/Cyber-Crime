import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ReportAccessedLog() {
const [report , setReport] = useState([])
  useEffect( () =>{
    const getReport =async () =>{
    
      const pendingReport =await axios.get('https://cyber-crime-desk-backend.onrender.com/home/admin-dashboard/report',{
        headers:{
          "Content-Type":"application/json"
        }
      })
      console.log(pendingReport.data.pendingReport,'pending report');
      setReport(pendingReport.data.pendingReport)
    }
    getReport();

  },[])


const text = "text-white"
  return (
    <>
    <h1 className='text-white font-bold text-3xl text-center'>Reports Accessed log</h1>
    <div className='grid grid-cols-3'>
    {
      report.map((r) =>(
        <div className="m-10 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl shadow-indigo-500 hover:scale-[1.01] transition duration-300">

  {/* Header */}
  <div className="p-4 flex justify-between items-center border-b border-gray-700">
    <h1 className="text-lg font-semibold text-gray-100">
      {r.name}
    </h1>

    {/* Status Badge */}
    <span className="px-3 py-1 text-sm font-medium rounded-full 
      bg-green-500/20 text-green-400 border border-green-500">
      Approved
    </span>
  </div>

  {/* Crime Type + Category */}
  <div className="p-4 flex flex-wrap gap-2">
    <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500">
      {r.crimeType}
    </span>

    <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400 border border-purple-500">
      {r.crimeCategory}
    </span>
  </div>

  {/* Description */}
  <div className="px-4 pb-4">
    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
      {r.description}
    </p>
  </div>

  {/* Footer */}
  <div className="px-4 py-3 bg-gray-900/50 rounded-b-2xl flex justify-between text-sm text-gray-400 border-t border-gray-700">
    <span>{new Date(r.date).toLocaleDateString()}</span>
    <span className="italic">Report ID: #{r._id?.slice(-5)}</span>
  </div>

</div>

    // <div className=' m-10 bg-gray-500/99 border-2 border-yellow-300 rounded-2xl'>
    //     <div className=' p-3 bg-gray-800 flex justify-between text-center rounded-t-2xl'>
    //       <h1 className='text-white '>{r.name}</h1>
    //       <button className='text-white border-2 border-green-400 bg-green-800 rounded-2xl  w-1/3'>Approved</button>
    //     </div>
    //     <div className='p-3  flex justify-baseline '>
    //       <h1 className='text-white'>{r.crimeType}</h1>
    //       <h1 className='text-white ml-3'>{r.crimeCategory}</h1>
    //     </div>
    //     <div className='p-3'>
    //       <h1 className='text-white'>{r.description}</h1>
          
    //     </div>
    //     <div>
    //       <h1 className='text-white'> {r.date}</h1>
    //     </div>
    // </div>

      ))
    }
    </div>
      
    </>
  )
}

export default ReportAccessedLog;
