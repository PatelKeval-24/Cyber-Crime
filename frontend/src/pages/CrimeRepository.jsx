import React, { useContext, useEffect, useState ,useRef} from 'react'
import axios from 'axios'
import { AuthContext } from '../AuthContext'

const CrimeRepository = () => {
const [report , setReport] = useState([])
const [view , setView] = useState(null)
const [loading , setLoading] = useState(true)
const token = useContext(AuthContext)
const formRef = useRef()

useEffect(() => {
  const getReports = async () =>{
    const reportinfo = await axios.get("http://localhost:3000/home/crime-repository",{ withCredentials: true},{
      headers :{
        "Content-Type": "application/json",
        Authorization :token.token
      }
    })
console.log(reportinfo.data);

    setReport(reportinfo.data.report)
    setLoading(false)
  }
  getReports();
  
},[] )
if(loading) return <p>Loading..</p>

const investigation = async (r) =>{
  const id = r._id;
  const report = await axios.patch("http://localhost:3000/home/crime-repository/investigation",{id,token},{ withCredentials: true},{
    headers :{
      "Content-Type":"application/json",
      Authorization :token.token
    }
   })
   console.log("reoprt assigned",report)
   console.log(report.data.message);
   
   if (report.data.status === "succes"){
    alert(report.data.message)
   }else{
    alert(report.data.message)
   }
    
}

  return (
    <div className='bg-gray-900 h-full'>
      <h1 className='text-white text-2xl font-bold text-center'>Crime Repository</h1>
      <div className='m-5 h-16 flex justify-center items-center border-2 border-red-500 '>
        <input type="text" placeholder='Search...' className='p-1 rounded bg-gray-800 text-white w-[40%]' />
        <button className='bg-indigo-500 text-white p-1 m-3 rounded'>Search</button>
      </div>

      <div className='m-5 grid grid-cols-2 border-2 border-red-500 overflow-y-scroll'>
        {report.map((r) => (
          <div className="w-6/7 m-10 flex flex-col justify bg-neutral-900 border-2 border-yellow-300/40 rounded-2xl shadow-lg hover:shadow-2xl shadow-indigo-500 hover:scale-[1.01] transition duration-300">
            <div className=" p-3 bg-gray-600/30 flex justify-between text-center rounded-t-2xl border-b-2 border-gray-500">
              <div className="flex flex-col justify-baseline ">
                <h1 className="text-white text-xl ">{r.name} </h1>
                <span className="text-xs text-white ">{r.email}</span>
              </div>
              <h1 className="text-white flex flex-col">
                <span className='text-purple-200 text-sm pr-2 pl-2 bg-purple-600/20 border border-none shadow shadow-emerald-300 rounded-2xl'>{r.status}</span>
                <span className='text-xs mt-2 bo'>
                {" "}
                {new Date(r.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                </span>
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
            {/* bottum part  */}
            <div className="p-2 mt-auto flex justify-between bg-gray-600/30 rounded-b-2xl border-t-2 border-gray-500 ">
              <button
                onClick={() => setView(r)}
                className="pr-4 pl-4 text-white text-sm border-2 border-sky-400 bg-sky-900/60 rounded-2xl "
              >
                View
              </button>
              <div className="">
                <button onClick={() =>investigation(r)} className="mr-2 pr-2 pl-2 text-white text-sm border-2 border-green-400 bg-green-400/20 rounded-2xl ">
                  Investigate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {view && (
        <div onClick={() => setView(null)} className="flex justify-center items-center backdrop-blur-xs fixed inset-0
">
          <div onClick={(e) => e.stopPropagation() } className="h-11/15 w-11/15 bg-neutral-700/60 border rounded-2xl flex flex-col shadow-lg shadow-blue-300">
            <h1 className="text-white text-center font-bold m-2">
              Report Details{" "}
            </h1>

            <div className="flex p-10 gap-4">
              {/* victim details  */}
              <div className="w-1/2   ">
                <h1 className="text-center text-indigo-300/80 font-bold text-2xl">
                  Victim inforamtion
                </h1>
                <div className="flex flex-col p-4 bg-neutral-900/60 rounded-3xl gap-4">
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Name :</span>
                    <span className="text-gray-300 ">{view.name}</span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Age :</span>
                    <span className="text-gray-300 ">{view.age} </span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Gender :</span>
                    <span className="text-gray-300 ">{view.gender} </span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Contact :</span>
                    <span className="text-gray-300 ">{view.contact}</span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Email :</span>
                    <span className="text-gray-300 ">{view.email} </span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Address :</span>
                    <span className="text-gray-300 ">
                      {view.victimAddress}{" "}
                    </span>
                  </div>
                </div>
              </div>

              {/* crime detail  */}
              <div className="w-1/2">
                <h1 className="text-center text-indigo-300/80 font-bold text-2xl">
                  Crime information
                </h1>
                <div className="flex flex-col p-4 bg-neutral-900/60 rounded-3xl gap-4">
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Crime Type :</span>
                    <span className="text-gray-300 ">{view.crimeType}</span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Crime Category :</span>
                    <span className="text-gray-300 ">
                      {view.crimeCategory}{" "}
                    </span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Priority :</span>
                    <span className="text-gray-300 ">{view.priority} </span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Location :</span>
                    <span className="text-gray-300 ">{view.location}</span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Date :</span>
                    <span className="text-gray-300 ">{view.crimeDate} </span>
                  </div>
                  <div className="flex justify-between  border-b-2 border-b-neutral-600">
                    <span className="text-gray-300 ">Submited by :</span>
                    <span className="text-gray-300 ">{view.submitedBy} </span>
                  </div>
                </div>
              </div>
            </div>
              <h1 className="pl-5 ml-5 text-indigo-300/80 text-xl font-bold">Detailed Description :</h1>
            <div className="ml-10 mr-10 bg-neutral-900/60 border rounded-2xl">
              <p className="text-gray-300 text-sm pl-5 m-2">{view.description} </p>
            </div>




            {/* bottum part  */}
            <div className="p-2 mt-auto flex justify-end bg-neutral-900/90 rounded-b-2xl border-t-2 border-gray-500 ">
              <div className="">
                
                <button className="mr-2 pr-2 pl-2 text-white text-sm border-2 border-green-400 bg-green-400/20 rounded-2xl  w-">
                  Investigate
                </button>
                <button
                onClick={() => setView(null)}
                className="pr-4 pl-4 text-white text-sm border-2 border-gray-400 bg-gray-900/60 rounded-2xl "
              >
              પાછળ
              </button>
              </div>
            </div>
          </div>
        </div>
      )}


      </div>
  )
}

export default CrimeRepository
